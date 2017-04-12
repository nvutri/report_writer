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
var BPOAutoSumTool = React.createClass({
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
    var self = this;
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
    var resizeSelect = <select className="form-control" value={this.props.size} onChange={this.props.resize}>
      {this.FIELD_SIZES.map(function (size) {
        return <option key={'option_' + self.props.id + '_' + size} value={size}>Size {size}</option>
      })}
    </select>;
    return <RB.Popover id={this.props.id}>
      <RB.Row style={{margin: 5}}>
        <RB.Row>
          <RB.Button block={true} bsStyle="link" onClick={function() {
            self.props.selectSubfield(self)
          }}>
            <i className="fa fa-hand-pointer-o fa-1x"></i> Select
          </RB.Button>
        </RB.Row>
        <RB.Row>
          {deleteButton}
        </RB.Row>
        <RB.Row>
          {resizeSelect}
        </RB.Row>
      </RB.Row>
    </RB.Popover>
  }
});

module.exports = BPOAutoSumTool;
