/**
 * BPO Report Number area input component.
 */

var React = require('react');
var RB = require('react-bootstrap');

var BPOInputLabel = require('./BPOInputLabel.jsx');
var BPOTextInputTool = require('./BPOTextInputTool.jsx');
var update = require('react-addons-update');

/**
 * Saving delay as user make changes.
 * @type {number}
 */
const SAVING_DELAY = 1200;


/**
 * BPO Report Number Input field.
 * @public
 */
var BPONumberInput = React.createClass({
  getInitialState: function () {
    return {
      value: this.props.value,
      saving: false,
      selected: this.props.selected,
      label_size: this.props.label_size
    }
  },
  componentWillReceiveProps: function (nextProps) {
    this.setState({selected: nextProps.selected});
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
  /**
   * Handle typing change value.
   * @param event
   */
  handleValueChange: function (event) {
    var newValue = 0;
    if (event.target.value.length > 0) {
      newValue = event.target.value;
    }
    this.setState({value: newValue});
    this.props.numberChanged(this, parseFloat(newValue));
    setTimeout(this.saveValueChange, SAVING_DELAY);
  },
  /**
   * Handle event selecting the input as part of the auto sum fields.
   */
  handleSelect: function () {
    if (this.props.selecting) {
      var newSelectedState = !this.state.selected;
      this.setState(update(this.state, {$set: {selected: newSelectedState}}));
      this.props.numberSelected(this, newSelectedState);
    }
  },
  /**
   * Render number input allowing visual display of selection.
   * @returns {XML}
   */
  render: function () {
    var inputStyle = {};
    if (this.props.selecting) {
      const inputColor = this.state.selected ? "blue" : "yellow";
      inputStyle = {
        borderColor: inputColor,
        borderWidth: "medium"
      };
    }
    var inputElem = <input className="form-control"
                           value={this.state.value}
                           placeholder={this.props.label}
                           onChange={this.handleValueChange}
                           style={inputStyle}
                           disabled={this.props.edit}
                           onClick={this.handleSelect}
      />;
    if (this.props.unit) {
      inputElem = <div className="input-group">
        {inputElem}
        <span className="input-group-addon">{this.props.unit}</span>
      </div>
    }
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
          {inputElem}
        </RB.Col>
      </RB.Row>
    )
  }
});

module.exports = BPONumberInput;
