/*eslint-disable */
define(["../../../component/config"], function (_config) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var Banner =
  /*#__PURE__*/
  function () {
    function Banner() {}

    var _proto = Banner.prototype;

    /**
     * Read heading type and title from the element
     *
     * @param element HTMLElement
     * @returns {Promise<any>}
     */
    _proto.read = function read(element) {
      var target = element.querySelector("a").getAttribute("target");
      var response = {
        background_size: element.style.backgroundSize,
        button_text: element.dataset.buttonText,
        image: this.generateImageObject(element.querySelector('.pagebuilder-banner-image').getAttribute('style').split(';')[0]),
        link_url: element.querySelector("a").getAttribute("href"),
        message: element.querySelector('.pagebuilder-poster-content div').innerHTML,
        minimum_height: element.querySelector('.pagebuilder-banner-wrapper').style.minHeight.split('px')[0],
        mobile_image: element.querySelector('.pagebuilder-banner-mobile') ? this.generateImageObject(element.querySelector('.pagebuilder-banner-mobile').getAttribute('style').split(';')[0]) : "",
        open_in_new_tab: target && target === "_blank" ? "1" : "0",
        overlay_color: element.querySelector('.pagebuilder-poster-overlay').style.backgroundColor === "transparent" ? "" : this.convertRgbaToHex(element.querySelector('.pagebuilder-poster-overlay').style.backgroundColor),
        overlay_transparency: element.querySelector('.pagebuilder-poster-overlay').style.backgroundColor === "transparent" ? "0" : this.extractAlphaFromRgba(element.querySelector('.pagebuilder-poster-overlay').style.backgroundColor),
        show_button: element.querySelector(".pagebuilder-banner-show-button") ? "on_hover" : "always",
        show_overlay: element.querySelector(".pagebuilder-banner-show-overlay-hover") ? "on_hover" : this.getShowOverlay(element.querySelector('.pagebuilder-poster-overlay').style.backgroundColor)
      };
      return Promise.resolve(response);
    };
    /**
     * Get show overlay setting
     *
     * @returns string
     */


    _proto.getShowOverlay = function getShowOverlay(value) {
      return value === "transparent" ? "never_show" : "always";
    };
    /**
     * Convert RGBA to HEX for content overlay color
     *
     * @returns string
     */


    _proto.convertRgbaToHex = function convertRgbaToHex(value) {
      var values = value.match(/\d+/g);
      var r = parseInt(values[0]).toString(16);
      var g = parseInt(values[1]).toString(16);
      var b = parseInt(values[2]).toString(16);
      return this.padZero(r) + this.padZero(g) + this.padZero(b);
    };
    /**
     * Adds 0 if hex value is string character
     *
     * @returns string
     */


    _proto.padZero = function padZero(value) {
      if (value.length == 1) {
        value = "0" + value;
      }

      return value;
    };
    /**
     * Extract the Alpha component from RGBA for overlay transparency
     *
     * @returns int
     */


    _proto.extractAlphaFromRgba = function extractAlphaFromRgba(value) {
      var a = parseFloat(value.match(/\d+/g)[3] + "." + value.match(/\d+/g)[4]);
      return a * 100;
    };
    /**
     * Convert decimal to percent for transparent overlay for the element
     *
     * @param {string} value
     * @returns {string}
     */


    _proto.convertDecimalToPercent = function convertDecimalToPercent(value) {
      return (parseInt(value, 10) * 100).toString();
    };
    /**
     * Fetch the image object
     *
     * @param {string} src
     * @returns {ImageObject}
     */


    _proto.generateImageObject = function generateImageObject(src) {
      // Match the URL & type from the directive
      if (/{{.*\s*url="?(.*\.([a-z|A-Z]*))"?\s*}}/.test(decodeURIComponent(src))) {
        var _$exec = /{{.*\s*url="?(.*\.([a-z|A-Z]*))"?\s*}}/.exec(decodeURIComponent(src)),
            _url = _$exec[1],
            _type = _$exec[2];

        return [{
          name: _url.split("/").pop(),
          size: 0,
          type: "image/" + _type,
          url: _config.getInitConfig("media_url") + _url
        }];
      }

      return "";
    };

    return Banner;
  }();

  return Banner;
});
//# sourceMappingURL=banner.js.map
