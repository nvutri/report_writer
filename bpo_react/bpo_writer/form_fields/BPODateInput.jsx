/**
 * BPO Report Date area input component.
 */

var React = require('react');
var RB = require('react-bootstrap');

var DateTimeField = require('react-bootstrap-datetimepicker');
var BPOInputLabel = require('./BPOInputLabel.jsx');
var BPOTextInputTool = require('./BPOTextInputTool.jsx');
var moment = require('moment');

/**
 * Saving delay as user make changes.
 * @type {number}
 */
const SAVING_DELAY = 1200;


/**
 * BPO Report Date Input field.
 * @public
 */
var BPODateInput = React.createClass({
  invalidState: 'Invalid date',
  getInitialState: function () {
    var value = this.props.value;
    if (!value || value == this.invalidState) {
      value = moment();
    }
    return {
      value: value,
      saving: false,
      label_size: this.props.label_size
    }
  },
  /**
   * Send changes to the server to save.
   */
  saveValueChange: function () {
    var self = this;
    if (this.isMounted() && !this.state.saving) {
      this.state.saving = true;
      $.ajax({
        url: './bpo_field/save_field/',
        dataType: 'json',
        type: 'POST',
        data: {
          field_id: this.props.field_id,
          value: this.state.value
        },
        success: function () {
          self.state.saving = false;
        }
      });
    }
  },
  handleValueChange: function (newDate) {
    this.setState({value: newDate});
    setTimeout(this.saveValueChange, SAVING_DELAY);
  },
  render: function () {
    return (
      <RB.Row>
        <RB.Col md={1}>
          {this.props.edit ? <BPOTextInputTool
            id={this.props.field_id}
            delete={this.props.delete}
            resize={this.props.resize}
            size={this.props.size}
            /> : ""}
        </RB.Col>
        <RB.Col md={this.state.label_size} className="text-right">
          <BPOInputLabel
            label={this.props.label}
            field_id={this.props.field_id}
            edit={this.props.edit}
            />
        </RB.Col>
        <RB.Col md={11 - this.state.label_size}>
          <DateTimeField
            dateTime={this.state.value}
            inputFormat="MM/DD/YYYY"
            fomat="MM/DD/YYYY"
            onChange={this.handleValueChange}
            viewMode="date"
            />
        </RB.Col>
      </RB.Row>
    )
  }
});

module.exports = BPODateInput;
