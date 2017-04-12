/**
 * Handle editing Field name.
 * @export
 */

var React = require('react');
var RB = require('react-bootstrap');

/**
 * BPO Field Tool for modifying Field Field list.
 * @export
 */
var BPOFieldTool = {
  FIELD_SIZES: [1, 2, 3, 4, 5, 6, 7, 8, 9 ,10, 11, 12],
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
   * Render the tool field button.
   * @returns {XML}
   */
  render: function () {
    var sizeFactor = this.state.hover ? "fa fa-cog fa-2x" : "fa fa-cog fa-1x";
    return (
      <div onMouseOver={this.handleHover} onMouseOut={this.noHover} style={{paddingTop: 5}}>
        <RB.OverlayTrigger trigger='click' rootClose placement='right' overlay={this.popOverLayout()}>
          <i className={sizeFactor}></i>
        </RB.OverlayTrigger>
      </div>
    )
  }
};

module.exports = BPOFieldTool;
