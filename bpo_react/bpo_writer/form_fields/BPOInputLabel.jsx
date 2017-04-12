/**
 * BPO Form Input Label editable.
 */

var React = require('react');

/**
 * Saving delay as user make changes.
 * @type {number}
 */
const SAVING_DELAY = 1200;

/**
 * BPO Report Form Input label editable.
 * @public
 */
var BPOInputLabel = React.createClass({
  getInitialState: function () {
    return {
      label: this.props.label,
      type: 'label',
      saving: false
    }
  },
  /**
   * Make label editable of a disabled input.
   */
  labelInput: function () {
    this.setState({type: 'input'});
  },
  /**
   * Turn disable input
   */
  labelEditable: function () {
    this.setState({type: 'editable'});
  },
  /**
   * Turn the label back to pure label. Non-editable.
   */
  labelBack: function () {
    this.setState({type: 'label'})
  },
  /**
   * Save the label input.
   */
  saveLabel: function () {
    var self = this;
    if (this.isMounted() && !this.state.saving) {
      this.state.saving = true;
      $.ajax({
        url: './bpo_field/save_field/',
        dataType: 'json',
        type: 'POST',
        data: {
          field_id: this.props.field_id,
          label: this.state.label
        },
        success: function () {
          self.state.saving = false;
        }
      });
    }
  },
  /**
   * Handle label changing reacting to change event.
   * @param event
   */
  handleLabelChange: function (event) {
    this.setState({label: event.target.value});
    setTimeout(this.saveLabel, SAVING_DELAY);
  },
  render: function () {
    if (this.props.edit) {
      switch (this.state.type) {
        case 'editable':
          return (
            <input className="form-control" value={this.state.label} placeholder="Input Label"
                   onMouseOut={this.labelBack} onChange={this.handleLabelChange}/>);
        case 'input':
          return (
            <input className="form-control" value={this.state.label} placeholder="Input Label"
                   onClick={this.labelEditable} onMouseOut={this.labelBack} disabled/>
          );
        case 'label':
          return (
            <label className="control-label" onMouseOver={this.labelInput}>
              {this.state.label}
            </label>
          );
      }
    } else {
      return (
        <label className="control-label" onMouseOver={this.labelInput}>
          {this.state.label}
        </label>
      );
    }
  }
});

module.exports = BPOInputLabel;
