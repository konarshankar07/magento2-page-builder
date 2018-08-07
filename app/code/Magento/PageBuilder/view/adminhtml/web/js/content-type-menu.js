/*eslint-disable */
define(["knockout"], function (_knockout) {
  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  /**
   * @api
   */
  var ContentTypeMenu =
  /*#__PURE__*/
  function () {
    /**
     * Options constructor
     *
     * @param parent
     * @param options
     */
    function ContentTypeMenu(parent, options) {
      var _this = this;

      this.parent = void 0;
      this.options = _knockout.observableArray([]);
      this.parent = parent;
      options.forEach(function (option) {
        _this.addOption(option);
      });
    }

    var _proto = ContentTypeMenu.prototype;

    /**
     * Add an option into the content type menu
     *
     * @param {OptionInterface} option
     * @param {boolean} skipSort
     */
    _proto.addOption = function addOption(option) {
      option.bindEvents();
      this.options.push(option);
      this.sort();
    };
    /**
     * Remove an option
     *
     * @param {string} code
     */


    _proto.removeOption = function removeOption(code) {
      this.options(this.options().filter(function (option) {
        return option.code !== code;
      }));
      this.sort();
    };
    /**
     * Get an option from the options array
     *
     * @param {string} code
     * @returns {OptionInterface}
     */


    _proto.getOption = function getOption(code) {
      return this.options().find(function (option) {
        return option.code === code;
      });
    };
    /**
     * Sort the options
     */


    _proto.sort = function sort() {
      this.options.sort(function (a, b) {
        return a.sort === b.sort ? 0 : a.sort < b.sort ? -1 : 1;
      });
    };

    _createClass(ContentTypeMenu, [{
      key: "template",
      get: function get() {
        return "Magento_PageBuilder/content-type/menu";
      }
    }]);

    return ContentTypeMenu;
  }();

  return ContentTypeMenu;
});
//# sourceMappingURL=content-type-menu.js.map
