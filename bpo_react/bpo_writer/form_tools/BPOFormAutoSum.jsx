/**
 * Handle main creation of a BPO Form.
 * @export
 */
var React = require('react');
var update = require('react-addons-update');
var RB = require('react-bootstrap');


/**
 * BPO Form Auto sum tool for managing number inputs and auto sum fields.
 * @export
 */
var BPOFormAutoSum = {
  /**
   * Allow selection of sub_fields.
   * @param auto_sum_tool to collect sub_fields to add up.
   */
  selectSubfield: function (auto_sum_tool) {
    var autoSum = auto_sum_tool.props.parent;
    this.setState({
      selected_fields: autoSum.state.sub_fields,
      selecting: true,
      auto_sum: autoSum
    });
  },
  /**
   * Register subfields for auto sum.
   * @param auto_sum_field
   */
  registerSubfields: function (auto_sum_field) {
    for (var sub_field_id in auto_sum_field.state.sub_fields) {
      this.state.auto_sub_fields[sub_field_id] = auto_sum_field;
    }
  },
  /**
   * Number field
   * @param number_field
   * @param selected
   */
  numberSelected: function (number_field, selected) {
    if (this.state.auto_sum) {
      this.state.auto_sum.manageSubfield(
        number_field.props.field_id,
        parseFloat(number_field.state.value),
        selected
      );
      this.state.auto_sub_fields[number_field.props.field_id] = selected ? this.state.auto_sum : null;
    }
  },
  /**
   * Change auto sum as number got changed.
   * @param number_field
   * @param number_value
   */
  numberChanged: function (number_field, number_value) {
    var auto_sum_field = this.state.auto_sub_fields[number_field.props.field_id];
    if (auto_sum_field) {
      auto_sum_field.manageSubfield(
        number_field.props.field_id,
        number_value,
        true
      );
    }
  }
};

module.exports = BPOFormAutoSum;
