/**
 * BPO Report Table.
 * @jsx React.DOM
 */

var React = require('react');
var BPOField = require('./BPOField.jsx');
var RB = require('react-bootstrap');
var update = require('react-addons-update');

/**
 * Create BPO Table.
 * @export
 */
var BPOTable = React.createClass({
  getInitialState: function () {
    return {
      field_ids: this.props.field_ids
    };
  },
  /**
   * Get fields before component mounted.
   */
  componentWillMount: function () {
    $.ajax({
      url: '/bpo/bpo_field/get_table/',
      dataType: 'json',
      type: 'GET',
      data: {
        table_id: this.props.table_id
      },
      success: function (field) {
        this.setState({
          label: field.label,
          type: field.type,
          field_ids: field.field_ids,
          rows: field.rows,
          cols: field.cols
        });
      }.bind(this)
    });
  },
  /**
   * Render one single row.
   * @param rowIndex
   */
  renderRow: function (rowIndex) {
    var colElems = [];
    for (var colIndex = 0; colIndex < this.state.cols; colIndex++) {
      var field_id = this.state.field_ids[rowIndex][colIndex];
      colElems.push(
        <td><BPOField
          key={field_id}
          field_id={field_id}
          />
        </td>
      )
    }
    return <tr>{colElems}</tr>
  },
  /**
   * Render the form of a topic.
   * @returns {XML}
   */
  render: function () {
    var rowElems = [];
    for (var rowIndex = 0; rowIndex < this.state.rows; rowIndex++) {
      rowElems.push(this.renderRow(rowIndex))
    }
    return (
      <table>
        <tbody>
        {rowElems}
        </tbody>
      </table>
    )
  }
});

module.exports = BPOTable;