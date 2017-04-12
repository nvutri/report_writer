/**
 * BPO Report Form field.
 */

var React = require('react');
var BPOTextInput = require('./BPOTextInput.jsx');
var BPONumberInput = require('./BPONumberInput.jsx');
var BPOMultipleChoice = require('./BPOMultipleChoice.jsx');
var BPODateInput = require('./BPODateInput.jsx');
var BPOAutoSum = require('./BPOAutoSum.jsx');
var BPOTextArea = require('./BPOTextArea.jsx');
var BPOTable = require('./BPOTable.jsx');

var RB = require('react-bootstrap');

/**
 * BPO Report Field.
 * @public
 */
var BPOField = React.createClass({
  FIELD_SIZE_RANGE: [1, 12],
  getInitialState: function () {
    return {
      label: '',
      value: '',
      type: '',
      text: '',
      size: 12,
      label_size: 4,
      choices: [],
      sub_fields: {},
      ranges: [null, null],
      unit: null,
      row: null
    }
  },

  /**
   * Get fields before component mounted.
   */
  componentWillMount: function () {
    $.ajax({
      url: '/bpo/bpo_field/get_field/',
      dataType: 'json',
      type: 'GET',
      data: {
        field_id: this.props.field_id
      },
      success: function (field) {
        this.setState({
          label: field.label,
          value: field.value,
          type: field.type,
          text: field.text,
          size: field.size,
          label_size: field.label_size,
          choices: field.choices,
          sub_fields: field.sub_fields,
          ranges: field.ranges,
          unit: field.unit,
          row: field.row
        });
      }.bind(this)
    });
  },

  /**
   * Render field based on type.
   * @returns {XML}
   */
  renderField: function () {
    switch (this.state.type) {
      case 'text_area':
        return <BPOTextArea
          label={this.state.label}
          value={this.state.value}
          field_id={this.props.field_id}
          delete={this.props.delete}
          edit={this.props.edit}
          type={this.state.type}
          size={this.state.size}
          label_size={this.state.label_size}
          resize={this.resizeField}
          />;
      case 'float_input':
      case 'integer_input':
        return <BPONumberInput
          label={this.state.label}
          value={this.state.value}
          ranges={this.state.ranges}
          unit={this.state.unit}
          field_id={this.props.field_id}
          delete={this.props.delete}
          edit={this.props.edit}
          type={this.state.type}
          selected={this.props.selected}
          selecting={this.props.selecting}
          numberSelected={this.props.numberSelected}
          numberChanged={this.props.numberChanged}
          size={this.state.size}
          label_size={this.state.label_size}
          resize={this.resizeField}
          />;
      case 'text_input':
        return <BPOTextInput
          label={this.state.label}
          value={this.state.value}
          field_id={this.props.field_id}
          delete={this.props.delete}
          edit={this.props.edit}
          type={this.state.type}
          size={this.state.size}
          label_size={this.state.label_size}
          resize={this.resizeField}
          />;
      case 'date_input':
        return <BPODateInput
          label={this.state.label}
          value={this.state.value}
          field_id={this.props.field_id}
          delete={this.props.delete}
          edit={this.props.edit}
          size={this.state.size}
          label_size={this.state.label_size}
          resize={this.resizeField}
          />;
      case 'multiple_choice':
        return <BPOMultipleChoice
          label={this.state.label}
          value={this.state.value}
          field_id={this.props.field_id}
          choices={this.state.choices}
          delete={this.props.delete}
          edit={this.props.edit}
          type={this.state.type}
          size={this.state.size}
          label_size={this.state.label_size}
          resize={this.resizeField}
          />;
      case 'auto_sum':
        return <BPOAutoSum
          label={this.state.label}
          value={this.state.value}
          field_id={this.props.field_id}
          delete={this.props.delete}
          edit={this.props.edit}
          type={this.state.type}
          size={this.state.size}
          unit={this.state.unit}
          label_size={this.state.label_size}
          sub_fields={this.state.sub_fields}
          resize={this.resizeField}
          selectSubfield={this.props.selectSubfield}
          registerSubfields={this.props.registerSubfields}
          />;
      case 'table':
        return <BPOTable
          table_id={this.props.field_id}
          />;
      default:
        return <div></div>
    }
  },
  /**
   * Resize the field based on column 12.
   * @param event
   */
  resizeField: function (event) {
    var newSize = event.target.value;
    newSize = Math.max(newSize, this.FIELD_SIZE_RANGE[0]);
    newSize = Math.min(newSize, this.FIELD_SIZE_RANGE[1]);
    this.setState({size: newSize});
    $.ajax({
      url: './bpo_field/save_field/',
      dataType: 'json',
      type: 'POST',
      data: {
        field_id: this.props.field_id,
        size: newSize
      }
    });
  },
  /**
   * General renderer for all form fields.
   * @returns {XML}
   */
  render: function () {
    return (
      <RB.Col md={this.state.size}>
        <div className="form-group">
          {this.renderField()}
        </div>
      </RB.Col>
    )
  }
});

module.exports = BPOField;