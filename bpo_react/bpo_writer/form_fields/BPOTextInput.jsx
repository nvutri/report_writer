/**
 * BPO Report Text area input component.
 */

var React = require('react');
var BPOInputLabel = require('./BPOInputLabel.jsx');
var BPOTextInputTool = require('./BPOTextInputTool.jsx');
var RB = require('react-bootstrap');

/**
 * Saving delay as user make changes.
 * @type {number}
 */
const SAVING_DELAY = 1200;


/**
 * BPO Report Text Input field.
 * @public
 */
var BPOTextInput = React.createClass({
  getInputType: function () {
    switch (this.props.type) {
      case 'number_input':
        return 'number';
      default:
        return 'text'
    }
  },
  getInitialState: function () {
    return {
      value: this.props.value,
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
  handleValueChange: function (event) {
    this.setState({value: event.target.value});
    setTimeout(this.saveValueChange, SAVING_DELAY);
  },
  resizeLabel: function (newSize) {
    this.setState({label_size: newSize});
  },
  render: function () {
    return (
      <RB.Row>
        <RB.Col md={1}>
          {
            this.props.edit ?
              <BPOTextInputTool
                id={this.props.field_id}
                delete={this.props.delete}
                resize={this.props.resize}
                resizeLabel={this.resizeLabel}
                size={this.props.size}
                />
              :
              ""
          }
        </RB.Col>
        <RB.Col md={this.state.label_size} className="text-right">
          <BPOInputLabel
            label={this.props.label}
            field_id={this.props.field_id}
            edit={this.props.edit}
            />
        </RB.Col>
        <RB.Col md={11 - this.state.label_size}>
          <input className="form-control"
                 value={this.state.value}
                 placeholder={this.props.label}
                 onChange={this.handleValueChange}
                 type={this.getInputType()}
            />
        </RB.Col>
      </RB.Row>
    )
  }
});

module.exports = BPOTextInput;
