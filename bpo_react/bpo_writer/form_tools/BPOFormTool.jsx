/**
 * Handle main creation of a BPO Form.
 * @export
 */
var React = require('react');
var update = require('react-addons-update');
var RB = require('react-bootstrap');


/**
 * BPO Form Tool for modifying Form Topic list and form.
 * @export
 */
var BPOFormTool = {
  /**
   * Add Text box input for the form field.
   */
  addTextInput: function () {
    var self = this;
    $.ajax({
      url: './bpo_field/add_field/',
      dataType: 'json',
      type: 'POST',
      data: {
        label: 'New Input Textbox',
        type: 'text_input',
        topic_id: this.props.topic_id
      },
      success: function (bpoField) {
        self.setState(update(self.state, {
          field_ids: {
            $push: [bpoField['id']]
          }
        }));
      }
    });
  },
  /**
   * Add Date box input for the form field.
   */
  addDateInput: function () {
    var self = this;
    $.ajax({
      url: './bpo_field/add_field/',
      dataType: 'json',
      type: 'POST',
      data: {
        label: 'New Date Input',
        type: 'date_input',
        topic_id: this.props.topic_id
      },
      success: function (bpoField) {
        self.setState(update(self.state, {
          field_ids: {
            $push: [bpoField['id']]
          }
        }));
      }
    });
  },
  /**
   * Add Number box input for the form field.
   */
  addNumberInput: function () {
    var self = this;
    $.ajax({
      url: './bpo_field/add_field/',
      dataType: 'json',
      type: 'POST',
      data: {
        label: 'New Number Input',
        type: 'number_input',
        topic_id: this.props.topic_id
      },
      success: function (bpoField) {
        self.setState(update(self.state, {
          field_ids: {
            $push: [bpoField['id']]
          }
        }));
      }
    });
  },
  /**
   * Add multiple choice input for the form field.
   */
  addMultipleChoice: function () {
    var self = this;
    $.ajax({
      url: './bpo_field/add_field/',
      dataType: 'json',
      type: 'POST',
      data: {
        label: 'New Multiple Choice',
        type: 'multiple_choice',
        topic_id: this.props.topic_id
      },
      success: function (bpoField) {
        self.setState(update(self.state, {
          field_ids: {
            $push: [bpoField['id']]
          }
        }));
      }
    });
  },
  /**
   * Add auto sum for the form field.
   */
  addAutoSum: function () {
    var self = this;
    $.ajax({
      url: './bpo_field/add_field/',
      dataType: 'json',
      type: 'POST',
      data: {
        label: 'New Auto Sum',
        type: 'auto_sum',
        topic_id: this.props.topic_id
      },
      success: function (bpoField) {
        self.setState(update(self.state, {
          field_ids: {
            $push: [bpoField['id']]
          }
        }));
      }
    });
  },
  /**
   * Delete field out of the form.
   * @param field_id
   * @param field_index
   */
  deleteField: function (field_id, field_index) {
    this.setState(update(
      this.state, {
        field_ids: {
          $splice: [[field_index, 1]]
        }
      })
    );
    $.ajax({
      url: './bpo_field/delete_field/',
      dataType: 'json',
      type: 'POST',
      data: {
        topic_id: this.props.topic_id,
        field_id: field_id
      }
    });
  },
  renderTools: function () {
    return <RB.ButtonToolbar>
      <RB.Button bsStyle="info" type="button" bsSize="small"
                 onClick={this.addTextInput} disabled={this.state.saving}>
        <span><i className="fa fa-plus fa-2x"></i> Text</span>
      </RB.Button>
      <RB.Button bsStyle="info" type="button" bsSize="small"
                 onClick={this.addNumberInput} disabled={this.state.saving}>
        <span><i className="fa fa-plus fa-2x"></i> Number</span>
      </RB.Button>
      <RB.Button bsStyle="info" type="reset" bsSize="small"
                 onClick={this.addMultipleChoice} disabled={this.state.saving}>
        <span><i className="fa fa-plus fa-2x"></i> Multiple Choice</span>
      </RB.Button>
      <RB.Button bsStyle="info" type="button" bsSize="small"
                 onClick={this.addDateInput} disabled={this.state.saving}>
        <span><i className="fa fa-plus fa-2x"></i> Date</span>
      </RB.Button>
      <RB.Button bsStyle="info" type="button" bsSize="small"
                 onClick={this.addAutoSum} disabled={this.state.saving}>
        <span><i className="fa fa-plus fa-2x"></i> Auto Sum</span>
      </RB.Button>
    </RB.ButtonToolbar>;
  }
};

module.exports = BPOFormTool;
