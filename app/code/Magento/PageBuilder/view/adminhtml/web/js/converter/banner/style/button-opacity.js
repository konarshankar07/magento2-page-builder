/*eslint-disable */
define([], function () {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var ButtonOpacity =
  /*#__PURE__*/
  function () {
    function ButtonOpacity() {}

    var _proto = ButtonOpacity.prototype;

    /**
     * Convert value to internal format
     *
     * @param value string
     * @returns {string | Object}
     */
    _proto.fromDom = function fromDom(value) {
      return value;
    };
    /**
     * Convert value to knockout format
     *
     * @param name string
     * @param data Object
     * @returns {string | Object}
     */


    _proto.toDom = function toDom(name, data) {
      return data.show_button === "always" ? "1" : "0";
    };

    return ButtonOpacity;
  }();

  return ButtonOpacity;
});
//# sourceMappingURL=button-opacity.js.map
