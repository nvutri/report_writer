/**
 * BPO Report Multiple Choice Input field.
 */

var React = require('react');
var update = require('react-addons-update');
var RB = require('react-bootstrap');

const SAVING_DELAY = 1200;

/**
 * BPO Report Multiple Choice Input field.
 * @public
 */
var BPOMultipleChoiceField = React.createClass({
  getInitialState: function () {
    return {
      value: this.props.value,
      saving: false,
      confirm_delete: false
    }
  },
  /**
   * Save new choice to the server.
   */
  saveValueChange: function () {
    var self = this;
    if (!this.state.saving) {
      this.setState({saving: true});
      $.ajax({
        url: './bpo_field/edit_choice/',
        dataType: 'json',
        type: 'POST',
        data: {
          field_id: this.props.field_id,
          choice: this.state.value,
          choice_index: this.props.index,
          action: 'edit'
        },
        success: function () {
          self.setState({saving: false});
        }
      });
    }
  },
  /**
   * Sync new choice value to server.
   * @param newChoice
   * @param choiceIndex
   */
  handleValueChange: function (newChoice) {
    var self = this;
    this.setState(update(this.state, {
      value: {
        $set: newChoice
      }
    }));
    this.props.changeChoice(this.props.index, newChoice);
    setTimeout(self.saveValueChange, SAVING_DELAY);
  },
  /**
   * Alternate confirm_state.
   */
  confirmDelete: function () {
    this.setState({confirm_delete: true});
  },
  /**
   * Disable button a proceed to delete in backend.
   */
  processDelete: function () {
    this.setState({saving: true});
    this.props.deleteChoice(this.props.index);
  },
  /**
   * Render choice as a radio box in a view mode.
   * Render choice as Input for changes in edit mode.
   * @returns {XML}
   */
  render: function () {
    var self = this;
    if (this.props.edit) {
      const deleteStyle = {marginTop: 0};
      return <div className="row">
        <div className="col-md-10">
          <div className="input-group">
            <span className="input-group-addon"><input type="radio" checked={this.props.checked} disabled/></span>
            <input
              className="form-control"
              value={this.state.value}
              placeholder={this.props.label}
              onChange={function(e) {
            self.handleValueChange(e.target.value);
          }}
            />
          </div>
        </div>
        <div className="col-md-1">
          {
            this.state.confirm_delete ?
              <RB.Button style={deleteStyle} bsStyle="danger" bsSize="xsmall"
                         onClick={this.processDelete}
                         disabled={this.state.saving}>
                <i className="fa fa-ban fa-2x"></i>
              </RB.Button> :
              <RB.Button style={deleteStyle} bsStyle="link" bsSize="xsmall" onClick={this.confirmDelete}
                         disabled={this.state.saving}>
                <i className="fa fa-ban fa-2x"></i>
              </RB.Button>
          }
        </div>
      </div>
    } else {
      return <option value={this.state.value}>
        {this.state.value}
      </option>
    }
  }
});

module.exports = BPOMultipleChoiceField;
