/**
 * BPO Report Text area input component.
 */

var React = require('react');
var update = require('react-addons-update');

var BPOInputLabel = require('./BPOInputLabel.jsx');
var BPOMultipleChoiceField = require('./BPOMultipleChoiceField.jsx');
var BPOMultipleChoiceTool = require('./BPOMultipleChoiceTool.jsx');

/**
 * BPO Report Multiple Choice Input field.
 * @public
 */
var BPOMultipleChoice = React.createClass({
  getInitialState: function () {
    return {
      value: this.props.value,
      saving: false,
      choices: this.props.choices ? this.props.choices : []
    }
  },
  /**
   * Set the selected option as value and send to server.
   * @param choiceIndex
   */
  selectChoice: function (choiceIndex) {
    this.setState({
      value: this.state.choices[choiceIndex]
    });
    var self = this;
    if (!this.state.saving) {
      this.state.saving = true;
      $.ajax({
        url: './bpo_field/save_field/',
        dataType: 'json',
        type: 'POST',
        data: {
          field_id: this.props.field_id,
          value: this.state.choices[choiceIndex]
        },
        success: function () {
          self.state.saving = false;
        }
      });
    }
  },
  /**
   * Change option choice without reseting state for better performance.
   * @param choiceIndex
   * @param newChoice
   */
  changeChoice: function (choiceIndex, newChoice) {
    this.state.choices[choiceIndex] = newChoice;
  },
  /**
   * Delete option choice syncing to the server.
   * @param choiceIndex
   */
  deleteChoice: function (choiceIndex) {
    var self = this;
    if (!this.state.saving) {
      this.setState({saving: true});
      $.ajax({
        url: './bpo_field/edit_choice/',
        dataType: 'json',
        type: 'POST',
        data: {
          field_id: this.props.field_id,
          choice_index: choiceIndex,
          choice: self.state.choices[choiceIndex],
          action: 'delete'
        },
        success: function () {
          self.setState(update(self.state, {
            choices: {
              $splice: [[choiceIndex, 1]]
            },
            saving: {
              $set: false
            }
          }));
        }
      })
    }
  },
  /**
   * Add a new choice.
   */
  addChoice: function () {
    const choiceTitle = 'New Input Choice';
    var self = this;
    if (!this.state.saving) {
      this.state.saving = true;
      $.ajax({
        url: './bpo_field/edit_choice/',
        dataType: 'json',
        type: 'POST',
        data: {
          field_id: this.props.field_id,
          choice: choiceTitle,
          action: 'add'
        },
        success: function () {
          self.setState(update(self.state, {
            choices: {
              $push: [choiceTitle]
            },
            saving: {
              $set: false
            }
          }));
        }
      });
    }
  },
  render: function () {
    var self = this;
    return (
      <div className="row">
        <div className="col-md-1">
          {this.props.edit ? <BPOMultipleChoiceTool
            id={this.props.field_id}
            delete={this.props.delete}
            addChoice={this.addChoice}
          />:""}
        </div>
        <div className="col-md-3 text-right">
          <BPOInputLabel
            label={this.props.label}
            field_id={this.props.field_id}
            edit={this.props.edit}
          />
        </div>
        <div className="col-md-8">
          {
            this.state.choices.map(function(choice, index) {
              return <BPOMultipleChoiceField
                field_id={self.props.field_id}
                value={choice}
                index={index}
                edit={self.props.edit}
                key={choice + index}
                checked={self.state.value == choice}
                selectChoice={self.selectChoice}
                changeChoice={self.changeChoice}
                deleteChoice={self.deleteChoice}
              />
              })
            }
        </div>
      </div>
    )
  }
});

module.exports = BPOMultipleChoice;
