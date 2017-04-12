/**
 * BPO Report Topic Draggable.
 * Source: React-DND Simple List Reoreder example.
 */

var React = require('react');
var ReactDOM = require('react-dom');

var BPOComponentType = require('./BPOComponentType.jsx');

/**
 * Source topic begin dragging.
 * @type {{beginDrag: exports.TopicSource.beginDrag}}
 */
module.exports.TopicSource = {
  beginDrag: function (props) {
    return props;
  }
};

/**
 * Target topic react on hovering over.
 * @type {{hover: exports.TopicTarget.hover}}
 */
module.exports.TopicTarget = {
  canDrop: function () {
    return true;
  },
  drop: function (hoverProps, monitor, hoverComponent) {
    const dragProps = monitor.getItem();
    // Determine rectangle on screen
    const hoverBoundingRect = ReactDOM.findDOMNode(hoverComponent).getBoundingClientRect();
    // Get vertical middle
    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
    // Determine mouse position
    const clientOffset = monitor.getClientOffset();

    if (clientOffset) {
      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      const hoverDistance = hoverClientY * 4 / 5;

      // Consider inserting if hover right over middle.
      if (hoverClientY < hoverMiddleY + hoverDistance && hoverClientY > hoverClientY - hoverDistance) {
        // The dragged item not already a child
        if (dragProps.parent_id != hoverProps.id) {
          // Insert to topic list if component is over and not collapsed.
          if (dragProps.type === BPOComponentType.TOPIC &&
            hoverProps.type === BPOComponentType.TOPIC_LIST &&
            !hoverComponent.state.collapsed) {
            if (hoverComponent.insertTopic(dragProps)) {
              dragProps.removeTopic(dragProps.id)
            }
          }
        }
      }
    }
  },
  hover: function (hoverProps, monitor, hoverComponent) {
    const dragProps = monitor.getItem();
    const dragIndex = dragProps.index;
    const dragId = dragProps.id;
    const hoverIndex = hoverProps.index;
    // Don't replace items with themselves
    if (dragIndex === hoverIndex) {
      return;
    }

    // Determine rectangle on screen
    const hoverBoundingRect = ReactDOM.findDOMNode(hoverComponent).getBoundingClientRect();

    // Get vertical middle
    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

    // Determine mouse position
    const clientOffset = monitor.getClientOffset();

    // Get pixels to the top
    const hoverClientY = clientOffset.y - hoverBoundingRect.top;
    const hoverDistance = hoverClientY * 4 / 5;
    // Only perform the move when the mouse has crossed half of the items height
    // When dragging downwards, only move when the cursor is below 50%
    // When dragging upwards, only move when the cursor is above 50%
    // Dragging downwards
    if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY + hoverDistance) {
      return;
    }

    // Dragging upwards
    if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY - hoverDistance) {
      return;
    }

    // Time to actually perform the action.
    // If in the same list. Just move.
    // Otherwise, insert in new list, and remove in the old list.
    if (dragProps.parent_id == hoverProps.parent_id) {
      // Not allow root to move around.
      if (!hoverProps.root) {
        hoverProps.moveTopic(dragIndex, dragId, hoverIndex);
        // Note: we're mutating the monitor item here!
        // Generally it's better to avoid mutations,
        // but it's good here for the sake of performance
        // to avoid expensive index searches.
        dragProps.index = hoverIndex;
      }
    }
  }
};

/**
 * Specifies which props to inject into your component.
 */
module.exports.CollectTarget = function (connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver()
  };
};

/**
 * Specifies which props to inject into your component.
 */
module.exports.CollectSource = function (connect, monitor) {
  return {
    // Call this function inside render()
    // to let React DnD handle the drag events:
    connectDragSource: connect.dragSource(),
    // You can ask the monitor about the current drag state:
    isDragging: monitor.isDragging()
  };
};
