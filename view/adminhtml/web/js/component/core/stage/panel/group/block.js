/**
 * - Block.js
 * A block that resides inside a group within the panel
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
define([
    'ko',
    'bluefoot/config'
], function (ko, Config) {

    /**
     * Content / page builder block residing inside groups within the panel
     *
     * @param block
     * @param group
     * @constructor
     */
    function Block(block, group) {
        this.config = block;
        this.code = ko.observable(block.code);
        this.name = ko.observable(block.name);
        this.icon = ko.observable(block.icon);

        this.group = group;
    }

    /**
     * On drag start hide the popped out panel
     *
     * @param draggableThis
     * @param event
     * @param ui
     * @param draggableInstance
     */
    Block.prototype.onDragStart = function (draggableThis, event, ui, draggableInstance) {
        // Transfer over the width and height to the helper
        var original = jQuery(event.target);
        ui.helper.css({width: original.width(), height: original.height()});

        // Hide the groups overlay
        this.group.hidden(true);
    };

    /**
     * On drag stop hide the popped out panel
     *
     * @param draggableThis
     * @param event
     * @param ui
     * @param draggableInstance
     */
    Block.prototype.onDragStop = function (draggableThis, event, ui, draggableInstance) {
        this.group.hidden(false);
    };

    /**
     * When the block is "dropped" into a column or row it will fire an onSortRecieve due to way we've combined
     * draggable and sortable.
     *
     * @param sortableThis
     * @param event
     * @param ui
     * @param sortableInstance
     */
    Block.prototype.onSortReceive = function (sortableThis, event, ui, sortableInstance) {
        // This event can fire multiple times, only capture the output once
        if (jQuery(event.target)[0] == sortableThis) {
            this.group.active(false);
            var parent = ko.dataFor(jQuery(event.target)[0]);
            console.log(parent);
        }
    };

    return Block;
});