/**
 * BPO Report Text area input component.
 */

var React = require('react');
var update = require('react-addons-update');
var RB = require('react-bootstrap');

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
      choices: this.props.choices ? this.props.choices : [],
      label_size: this.props.label_size
    }
  },
  /**
   * Set the selected option as value and send to server.
   * @param event
   */
  handleSelect: function (event) {
    this.setState({
      value: event.target.value
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
          value: event.target.value
        },
        success: function () {
          self.state.saving = false;
        }
      });
    }
  },
  /**
   * Change option choice without resetting state for better performance.
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
    if (this.props.edit) {
      return (
        <RB.Row>
          <RB.Col md={1}>
            <BPOMultipleChoiceTool
              id={this.props.field_id}
              key={'tool_' + this.props.field_id}
              delete={this.props.delete}
              addChoice={this.addChoice}
              resize={this.props.resize}
              size={this.props.size}
              />
          </RB.Col>
          <RB.Col md={this.state.label_size} className="text-right">
            <BPOInputLabel
              label={this.props.label}
              field_id={this.props.field_id}
              edit={this.props.edit}
              />
          </RB.Col>
          <RB.Col md={11 - this.state.label_size}>
            {
              this.state.choices.map(function (choice, index) {
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
          </RB.Col>
        </RB.Row>
      )
    } else {
      return (
        <RB.Row>
          <RB.Col md={1}></RB.Col>
          <RB.Col md={this.state.label_size} className="text-right">
            <BPOInputLabel
              label={this.props.label}
              field_id={this.props.field_id}
              edit={this.props.edit}
              />
          </RB.Col>
          <RB.Col md={11 - this.state.label_size}>
            <select className="form-control" value={this.state.value} onChange={this.handleSelect}>
              {
                this.state.choices.map(function (choice, index) {
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
            </select>
          </RB.Col>
        </RB.Row>
      )
    }

  }
});

module.exports = BPOMultipleChoice;
