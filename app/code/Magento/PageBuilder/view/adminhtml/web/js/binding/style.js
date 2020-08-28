/*eslint-disable */
/* jscs:disable */
define(["knockout", "mageUtils", "underscore", "Magento_PageBuilder/js/content-type/style-registry"], function (_knockout, _mageUtils, _underscore, _styleRegistry) {
  "use strict";

  _knockout = _interopRequireDefault(_knockout);
  _mageUtils = _interopRequireDefault(_mageUtils);
  _underscore = _interopRequireDefault(_underscore);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var originalStyle = _knockout.default.bindingHandlers.style;

  function isPageBuilderContext(context) {
    return !!(context.stage && context.stage.pageBuilder);
  }

  _knockout.default.bindingHandlers.style = {
    init: function init(element, valueAccessor, allBindings, viewModel, bindingContext) {
      if (isPageBuilderContext(bindingContext)) {
        element.setAttribute("data-style-id", _mageUtils.default.uniqueid());
      }
    },
    update: function update(element, valueAccessor, allBindings, viewModel, bindingContext) {
      if (isPageBuilderContext(bindingContext)) {
        var value = _knockout.default.utils.unwrapObservable(valueAccessor() || {});

        var styles = {};
        var className = "style-" + element.getAttribute("data-style-id");
        var existedStyleBlock = document.querySelector("[data-selector=\"" + className + "\"]");

        _knockout.default.utils.objectForEach(value, function (styleName, styleValue) {
          styleValue = _knockout.default.utils.unwrapObservable(styleValue);

          if (styleValue === null || styleValue === undefined || styleValue === false) {
            styleValue = "";
          }

          if (styleValue) {
            styles[styleName] = styleValue;
          }
        });

        if (existedStyleBlock) {
          existedStyleBlock.remove();
        }

        if (!_underscore.default.isEmpty(styles)) {
          var styleElement = document.createElement("style");
          styleElement.setAttribute("data-selector", className);
          styleElement.innerHTML = (0, _styleRegistry.generateCssBlock)(className, styles);
          element.classList.add(className);
          element.append(styleElement);
        }
      } else {
        originalStyle.update(element, valueAccessor, allBindings, viewModel, bindingContext);
      }
    }
  };
});
//# sourceMappingURL=style.js.map