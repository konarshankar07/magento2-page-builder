/*eslint-disable */
define(["jquery", "knockout", "uiEvents", "underscore", "Magento_PageBuilder/js/config", "Magento_PageBuilder/js/content-type-factory", "Magento_PageBuilder/js/panel/registry", "Magento_PageBuilder/js/utils/create-stylesheet"], function (_jquery, _knockout, _uiEvents, _underscore, _config, _contentTypeFactory, _registry, _createStylesheet) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /**
   * Return the sortable options for an instance which requires sorting / dropping functionality
   *
   * @param {Preview} preview
   * @returns {JQueryUI.SortableOptions | any}
   */
  function getSortableOptions(preview) {
    /**
     * @todo resolve issue with stage not conforming to the content type interface. e.g. not having a preview class
     * This corrects the paths to various things we require for the stage.
     */
    if (preview.config.name === "stage") {
      preview.stageId = preview.id;
      preview = {
        canReceiveDrops: preview.canReceiveDrops,
        parent: preview
      };
    }

    return {
      cursor: "-webkit-grabbing",
      tolerance: "pointer",
      helper: function helper(event, item) {
        var helper = (0, _jquery)(item).clone();
        helper.css({
          pointerEvents: "none"
        });
        return helper[0];
      },
      appendTo: document.body,
      containment: "document",
      placeholder: {
        element: function element() {
          return (0, _jquery)("<div />").addClass("pagebuilder-sortable-placeholder")[0];
        },
        update: function update() {
          return;
        }
      },
      handle: ".move-structural",
      items: "> .pagebuilder-content-type-wrapper",
      start: function start() {
        onSortStart.apply(this, [preview].concat(Array.prototype.slice.call(arguments)));
      },
      sort: function sort() {
        onSort.apply(this, [preview].concat(Array.prototype.slice.call(arguments)));
      },
      receive: function receive() {
        onSortReceive.apply(this, [preview].concat(Array.prototype.slice.call(arguments)));
      },
      update: function update() {
        onSortUpdate.apply(this, [preview].concat(Array.prototype.slice.call(arguments)));
      },
      stop: function stop() {
        onSortStop.apply(this, [preview].concat(Array.prototype.slice.call(arguments)));
      }
    };
  }

  var sortedContentType;
  /**
   * On sort start record the item being sorted
   *
   * @param {Preview} preview
   * @param {Event} event
   * @param {JQueryUI.SortableUIParams} ui
   */

  function onSortStart(preview, event, ui) {
    // Verify we're sorting an already created item
    if (ui.item.hasClass("pagebuilder-content-type-wrapper")) {
      var contentTypeInstance = _knockout.dataFor(ui.item[0]);

      if (contentTypeInstance) {
        // Ensure the original item is displayed but with reduced opacity
        ui.item.show().addClass("pagebuilder-sorting-original");
        sortedContentType = contentTypeInstance;
        showDropIndicators(contentTypeInstance.config.name); // Dynamically change the connect with option to restrict content types

        (0, _jquery)(this).sortable("option", "connectWith", getAllowedContainersClasses(contentTypeInstance.config.name));
        (0, _jquery)(this).sortable("refresh");
      }
    }
  }
  /**
   * On a sort action hide the placeholder if disabled
   *
   * @param {Preview} preview
   * @param {Event} event
   * @param {JQueryUI.SortableUIParams} ui
   */


  function onSort(preview, event, ui) {
    if ((0, _jquery)(this).sortable("option", "disabled")) {
      ui.placeholder.hide();
    } else {
      ui.placeholder.show();
    }
  }
  /**
   * On sort stop hide any indicators
   */


  function onSortStop(preview, event, ui) {
    sortedContentType = null;
    ui.item.removeClass("pagebuilder-sorting-original");
    hideDropIndicators();
    (0, _registry.setDraggedBlockConfig)(null);
  }
  /**
   * Handle receiving a block from the left panel
   *
   * @param {Preview} preview
   * @param {Event} event
   * @param {JQueryUI.SortableUIParams} ui
   */


  function onSortReceive(preview, event, ui) {
    if ((0, _jquery)(event.target)[0] !== this) {
      return;
    } // If the sortable instance is disabled don't complete this operation


    if ((0, _jquery)(this).sortable("option", "disabled")) {
      return;
    } // If the parent can't receive drops we need to cancel the operation


    if (!preview.canReceiveDrops()) {
      (0, _jquery)(this).sortable("cancel");
      return;
    }

    var blockConfig = (0, _registry.getDraggedBlockConfig)();

    if (blockConfig) {
      // jQuery's index method doesn't work correctly here, so use Array.findIndex instead
      var index = (0, _jquery)(event.target).children(".pagebuilder-content-type-wrapper, .pagebuilder-draggable-block").toArray().findIndex(function (element) {
        return element.classList.contains("pagebuilder-draggable-block");
      }); // Create the new content type and insert it into the parent

      (0, _contentTypeFactory)(blockConfig, preview.parent, preview.parent.stageId).then(function (block) {
        preview.parent.addChild(block, index);

        _uiEvents.trigger("block:dropped:create", {
          id: block.id,
          block: block
        });

        _uiEvents.trigger(blockConfig.name + ":block:dropped:create", {
          id: block.id,
          block: block
        });

        return block;
      }); // Remove the DOM element, as this is a drop event we can't just remove the ui.item

      (0, _jquery)(event.target).find(".pagebuilder-draggable-block").remove();
    }
  }
  /**
   * On sort update handle sorting the underlying children knockout list
   *
   * @param {Preview} preview
   * @param {Event} event
   * @param {JQueryUI.SortableUIParams} ui
   */


  function onSortUpdate(preview, event, ui) {
    // If the sortable instance is disabled don't complete this operation
    if ((0, _jquery)(this).sortable("option", "disabled")) {
      ui.item.remove();
      return;
    }

    if (sortedContentType && this === ui.item.parent()[0]) {
      var el = ui.item[0];

      var contentTypeInstance = _knockout.dataFor(el);

      var target = _knockout.dataFor(ui.item.parents(".content-type-container")[0]);

      if (target && contentTypeInstance) {
        // Calculate the source and target index
        var sourceParent = contentTypeInstance.parent;
        var targetParent = target.parent;
        var targetIndex = (0, _jquery)(event.target).children(".pagebuilder-content-type-wrapper, .pagebuilder-draggable-block").toArray().findIndex(function (element) {
          return element === el;
        });

        if (sourceParent) {
          (0, _jquery)(sourceParent === targetParent ? this : ui.sender || this).sortable("cancel");
        } else {
          (0, _jquery)(el).remove();
        }

        moveContentType(contentTypeInstance, targetIndex, targetParent);

        if (contentTypeInstance.parent !== targetParent) {
          ui.item.remove();
        }
      }
    }
  }
  /**
   * Move a content type to a new index, with the option to move to a new container
   *
   * @param {ContentType} contentType
   * @param {number} targetIndex
   * @param {ContentTypeCollection} targetParent
   */


  function moveContentType(contentType, targetIndex, targetParent) {
    if (targetParent === void 0) {
      targetParent = null;
    }

    var sourceParent = contentType.parent;
    var sourceIndex = contentType.parent.children().indexOf(contentType);
    var sourceParentChildren = sourceParent.getChildren();

    if (targetParent && sourceParent !== targetParent) {
      contentType.parent = targetParent; // Handle dragging between sortable elements

      sourceParentChildren.splice(sourceIndex, 1);
      targetParent.getChildren().splice(targetIndex, 0, contentType);
    } else {
      // Retrieve the children from the source parent
      var children = _knockout.utils.unwrapObservable(sourceParentChildren); // Inform KO that this value is about to mutate


      if (sourceParentChildren.valueWillMutate) {
        sourceParentChildren.valueWillMutate();
      } // Perform the mutation


      children.splice(sourceIndex, 1);
      children.splice(targetIndex, 0, contentType); // Inform KO that the mutation is complete

      if (sourceParentChildren.valueHasMutated) {
        sourceParentChildren.valueHasMutated();
      }
    } // Process any deferred bindings


    if (_knockout.processAllDeferredBindingUpdates) {
      _knockout.processAllDeferredBindingUpdates();
    } // @todo fire generic move event

  }

  var headDropIndicatorStyles;
  /**
   * Show the drop indicators for a specific content type
   *
   * We do this by creating a style sheet and injecting it into the head. It's dramatically quicker to allow the browsers
   * CSS engine to display these for us than manually iterating through the DOM and applying a class to the elements.
   *
   * @param {string} contentType
   * @returns {HTMLStyleElement}
   */

  function showDropIndicators(contentType) {
    var acceptedContainers = getContainersFor(contentType);

    if (acceptedContainers.length > 0) {
      var _createStyleSheet;

      var classNames = acceptedContainers.map(function (container) {
        return ".content-type-container." + container + "-container > .pagebuilder-drop-indicator";
      });
      var styles = (0, _createStylesheet.createStyleSheet)((_createStyleSheet = {}, _createStyleSheet[classNames.join(", ")] = {
        opacity: 1,
        visibility: "visible"
      }, _createStyleSheet));
      document.head.appendChild(styles);
      headDropIndicatorStyles = styles;
      return styles;
    }
  }
  /**
   * Hide the drop indicators
   */


  function hideDropIndicators() {
    if (headDropIndicatorStyles) {
      headDropIndicatorStyles.remove();
      headDropIndicatorStyles = null;
    }
  }

  var acceptedMatrix = {};
  /**
   * Build a matrix of which containers each content type can go into, these are determined by the allowed_parents
   * node within the content types configuration
   */

  function generateContainerAcceptedMatrix() {
    _underscore.values(_config.getConfig("content_types")).forEach(function (contentType) {
      acceptedMatrix[contentType.name] = contentType.allowed_parents.slice();
    });
  }
  /**
   * Retrieve the containers a specific content type can be contained in
   *
   * @param {string} contentType
   * @returns {any}
   */


  function getContainersFor(contentType) {
    if (acceptedMatrix[contentType]) {
      return acceptedMatrix[contentType];
    }

    return [];
  }
  /**
   * Generate classes of containers the content type is allowed within
   *
   * @param {string} contentType
   * @returns {string}
   */


  function getAllowedContainersClasses(contentType) {
    return getContainersFor(contentType).map(function (value) {
      return ".content-type-container." + value + "-container";
    }).join(", ");
  }

  return {
    getSortableOptions: getSortableOptions,
    moveContentType: moveContentType,
    showDropIndicators: showDropIndicators,
    hideDropIndicators: hideDropIndicators,
    generateContainerAcceptedMatrix: generateContainerAcceptedMatrix,
    getContainersFor: getContainersFor,
    getAllowedContainersClasses: getAllowedContainersClasses
  };
});
//# sourceMappingURL=sortable.js.map
