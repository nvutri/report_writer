/**
 * BPO Report Text area component.
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
 * BPO Report Text Area.
 * @public
 */
var BPOTextArea = React.createClass({
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
  render: function () {
    var inputField = <input className="form-control"
                            value={this.state.value}
                            onChange={this.handleValueChange}/>;
    var textArea = <label className="control-label">{this.state.value}</label>;
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
        <RB.Col md={11}>
          {this.props.edit ? inputField : textArea}
        </RB.Col>
      </RB.Row>
    )
  }
});

module.exports = BPOTextArea;
