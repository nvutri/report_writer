/**
 * BPO Report Text area input component.
 */

var React = require('react');
var update = require('react-addons-update');

var BPOInputLabel = require('./BPOInputLabel.jsx');
var BPOAutoSumTool = require('./BPOAutoSumTool.jsx');

/**
 * Saving delay as user make changes.
 * @type {number}
 */
const SAVING_DELAY = 1200;

/**
 * BPO Report Multiple Subfield Input field.
 * @public
 */
var BPOAutoSum = React.createClass({
  getInitialState: function () {
    return {
      value: this.props.value,
      saving: false,
      sub_fields: this.props.sub_fields ? this.props.sub_fields : {}
    }
  },
  /**
   * Run initialization right after component is mounted.
   */
  componentDidMount: function () {
    this.props.registerSubfields(this);
  },
  /**
   * Manage a new subfield.
   * @param subfield_id
   * @param subfield_value
   * @param subfield_selected determines whether the value is selected or not.
   */
  manageSubfield: function (subfield_id, subfield_value, subfield_selected) {
    if (subfield_selected) {
      this.state.sub_fields[subfield_id] = parseFloat(subfield_value);
    } else {
      delete this.state.sub_fields[subfield_id];
    }
    var total_value = 0;
    for (var fieldId in this.state.sub_fields) {
      if (this.state.sub_fields.hasOwnProperty(fieldId) && this.state.sub_fields[fieldId]) {
        total_value += parseFloat(this.state.sub_fields[fieldId]);
      }
    }
    this.setState(update(this.state, {value: {$set: total_value}}));
    setTimeout(this.saveValueChange, SAVING_DELAY);
  },
  /**
   * Send changes to the server to save.
   */
  saveValueChange: function () {
    var self = this;
    if (!this.state.saving) {
      this.state.saving = true;
      $.ajax({
        url: './bpo_field/save_field/',
        dataType: 'json',
        type: 'POST',
        data: {
          field_id: this.props.field_id,
          sub_fields: JSON.stringify(this.state.sub_fields),
          value: this.state.value
        },
        success: function () {
          self.state.saving = false;
        }
      });
    }
  },
  /**
   * Handle typing change value.
   * @param event
   */
  handleValueChange: function (event) {
    this.setState({value: event.target.value});
    setTimeout(this.saveValueChange, SAVING_DELAY);
  },
  /**
   * Render Auto Sum field to take total of all fields.
   * @returns {XML}
   */
  render: function () {
    var inputElem = <input className="form-control"
                           value={this.state.value}
                           placeholder={this.props.label}
                           onChange={this.handleValueChange}
                           type="number"
                           disabled={true}/>;
    if (this.props.unit) {
      inputElem = <div className="input-group">
        {inputElem}
        <span className="input-group-addon">{this.props.unit}</span>
      </div>
    }
    if (this.props.edit) {
      return (
        <div className="row">
          <div className="col-md-1">
            <BPOAutoSumTool
              id={this.props.field_id}
              key={'tool_' + this.props.field_id}
              delete={this.props.delete}
              selectSubfield={this.props.selectSubfield}
              resize={this.props.resize}
              size={this.props.size}
              parent={this}
            />
          </div>
          <div className="col-md-3 text-right">
            <BPOInputLabel
              label={this.props.label}
              field_id={this.props.field_id}
              edit={this.props.edit}
            />
          </div>
          <div className="col-md-7">
            {inputElem}
          </div>
        </div>
      )
    } else {
      return (
        <div className="row">
          <div className="col-md-4 text-right">
            <BPOInputLabel
              label={this.props.label}
              field_id={this.props.field_id}
              edit={this.props.edit}
            />
          </div>
          <div className="col-md-7">
            {inputElem}
          </div>
        </div>
      )
    }

  }
});

module.exports = BPOAutoSum;
