/**
 * Handle editing Topic and topic list name.
 * @export
 */

var React = require('react');
var RB = require('react-bootstrap');

/**
 * BPO Topic Tool for modifying Topic Topic list.
 * @export
 */
var BPOTopicTool = React.createClass({
  getInitialState: function () {
    return {
      hover: false,
      confirm_delete: false
    }
  },
  /**
   * Showing bigger size as hover.
   */
  handleHover: function () {
    this.setState({hover: true});
  },
  /**
   * Go back to regular no hovering state.
   */
  noHover: function () {
    this.setState({
      hover: false,
      confirm_delete: false
    });
  },
  /**
   * Turn state to confirming delete.loc
   */
  confirmDelete: function () {
    this.setState({confirm_delete: true});
  },
  /**
   * Implement pover over layout for user option.
   * @returns {XML}
   */
  popOverLayout: function () {
    var deleteButton = <RB.Button bsStyle="link" onClick={this.confirmDelete}>Delete</RB.Button>;
    if (this.state.confirm_delete) {
      deleteButton = <RB.Button block={true} bsStyle="danger" onClick={this.props.delete}>Confirm Delete</RB.Button>;
    }
    return <RB.Popover id={this.props.id}>
      <RB.Row style={{margin: 5}}>
        <RB.Row>
          <RB.Button bsStyle="link" onClick={this.props.rename}>Rename</RB.Button>
        </RB.Row>
        <RB.Row>
          {deleteButton}
        </RB.Row>
      </RB.Row>
    </RB.Popover>
  },
  render: function () {
    var sizeFactor = this.state.hover ? "fa fa-cog fa-2x" : "fa fa-cog fa-1x";
    return (
      <div className="pull-right" onMouseOver={this.handleHover} onMouseOut={this.noHover}>
        <RB.OverlayTrigger trigger='click' rootClose placement='right' overlay={this.popOverLayout()}>
          <i className={sizeFactor}></i>
        </RB.OverlayTrigger>
      </div>
    )
  }
});

module.exports = BPOTopicTool;
