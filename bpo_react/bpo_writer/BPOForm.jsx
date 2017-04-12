/**
 * BPO Report Form Edit & Creation.
 * @jsx React.DOM
 */

var React = require('react');
var BPOField = require('./form_fields/BPOField.jsx');
var BPOFormTool = require('./form_tools/BPOFormTool.jsx');
var BPOFormAutoSum = require('./form_tools/BPOFormAutoSum.jsx');
var RB = require('react-bootstrap');
var update = require('react-addons-update');

/**
 * Create BPO Form with fields.
 * @export
 */
var BPOForm = React.createClass({
  mixins: [BPOFormTool, BPOFormAutoSum],
  getInitialState: function () {
    return {
      field_ids: this.props.field_ids,
      parent_title: this.props.parent_title,
      selected_fields: {},
      selecting: false,
      edit: false,  // State that allows edit on form labels and making changes on fields.
      auto_sum: null,  // Auto sum field id.
      auto_sub_fields: {}
    };
  },
  /**
   * Switch edit state.
   */
  switchEdit: function () {
    if (this.state.edit) {
      this.setState({
        edit: false,
        selecting: false,
        selected_fields: {}
      })
    } else {
      this.setState({edit: true})
    }
  },
  /**
   * Render edit button.
   * @returns {XML}
   */
  renderEditButton: function () {
    var editButton;
    if (this.state.edit) {
      editButton = <RB.Button bsStyle="primary" bsSize="xsmall" onClick={this.switchEdit}>
        <span><i className="fa fa-eye"></i> View Only</span>
      </RB.Button>
    } else {
      editButton = <RB.Button bsStyle="info" bsSize="xsmall" onClick={this.switchEdit}>
        <span><i className="fa fa-pencil"></i> Edit Form</span>
      </RB.Button>
    }
    return <div className="pull-left">{editButton}</div>;
  },

  /**
   * Render row fields.
   * @returns {Array}
   */
  renderFieldRows: function () {
    var bpoRows = [];
    var fieldIndex = 0;
    var self = this;
    var bpoFields = this.props.field_ids.map(function (field_id, field_index) {
      return <BPOField
        key={field_id}
        field_id={field_id}
        edit={self.state.edit}
        selected={self.state.selecting ? self.state.selected_fields.hasOwnProperty(field_id) : null}
        selecting={self.state.selecting}
        delete={function() {self.deleteField(field_id, field_index);}}
        numberSelected={self.numberSelected}
        numberChanged={self.numberChanged}
        registerSubfields={self.registerSubfields}
        selectSubfield={self.selectSubfield}
        />;
    });
    // Combine all the elements that is in one row.
    while (fieldIndex < bpoFields.length) {
      var bpoRow = [bpoFields[fieldIndex++]];
      // Get all the next elements that are not row.
      while (fieldIndex < bpoFields.length && !this.props.row_ids[this.state.field_ids[fieldIndex]]) {
        bpoRow.push(bpoFields[fieldIndex++]);
      }
      bpoRows.push(bpoRow);
    }
    return bpoRows;
  },

  /**
   * Render the form of a topic.
   * @returns {XML}
   */
  render: function () {
    var toolElement = this.state.edit ? this.renderTools() : "";
    return (
      <div className="container-fluid">
        <RB.Row className="bpo-form">
          {this.props.editable ? this.renderEditButton() : ''}
          <h3 className="text-center">{this.props.title}</h3>
        </RB.Row>
        <RB.Row>
          <form className="form-horizontal">
            {
              this.renderFieldRows().map(function (row, rowIndex) {
                return <RB.Row key={'row_' + rowIndex}>{row}</RB.Row>;
              })
            }
          </form>
        </RB.Row>
        <RB.Row>
          {toolElement}
        </RB.Row>
      </div>
    )
  }
});

module.exports = BPOForm;