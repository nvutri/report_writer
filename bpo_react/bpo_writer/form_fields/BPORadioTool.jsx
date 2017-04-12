/**
 * Handle editing Field name.
 * @export
 */

var React = require('react');
var RB = require('react-bootstrap');
var BPOFieldTool = require('./BPOFieldTool.jsx');

/**
 * BPO Field Tool for modifying Field Field list.
 * @export
 */
var BPOMultipleChoiceTool = React.createClass({
  mixins: [BPOFieldTool],
  getInitialState: function () {
    return {
      hover: false,
      confirm_delete: false
    }
  },
  /**
   * Implement pover over layout for user option.
   * @returns {XML}
   */
  popOverLayout: function () {
    const deleteStyle = {marginTop: 0};
    var deleteButton = <RB.Button
      style={deleteStyle} bsStyle="link"
      onClick={this.confirmDelete}>Delete
    </RB.Button>;
    if (this.state.confirm_delete) {
      deleteButton = <RB.Button
        style={deleteStyle} block={true}
        bsStyle="danger"
        onClick={this.props.delete}>Confirm Delete
      </RB.Button>;
    }
    return <RB.Popover id={this.props.id}>
      <RB.Row style={{margin: 5}}>
        <RB.Row>
          <RB.Button block={true} bsStyle="link" onClick={this.props.addChoice}>
            <i className="fa fa-plus fa-1x"></i> Choice
          </RB.Button>
        </RB.Row>
        <RB.Row>
          {deleteButton}
        </RB.Row>
      </RB.Row>
    </RB.Popover>
  }
});

module.exports = BPOMultipleChoiceTool;
