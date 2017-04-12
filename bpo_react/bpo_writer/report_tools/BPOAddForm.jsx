/**
 * Handle adding new bpo topic form.
 * @export
 */

var React = require('react');
var RB = require('react-bootstrap');

var BPOAddForm = React.createClass({
  DEFAULT_TITLE: 'New Form',
  getInitialState: function () {
    return {
      saving: false
    }
  },
  /**
   * Add Form to backend server.
   * Reload the whole form upon success.
   */
  addForm: function () {
    if (this.state.saving) {
      return;
    }
    // Disable saving more.
    this.setState({saving: true});
    $.ajax({
        url: './bpo_report/create_topic_form/',
        dataType: 'json',
        type: 'POST',
        data: {
          report_id: this.props.report_id,
          title: this.DEFAULT_TITLE
        },
        success: function () {
          // Allow button function.
          this.setState({saving: false});
          // Reload the parent panel.
          window.location.reload();
        }.bind(this)
      }
    );
  },
  render: function () {
    return (
      <RB.Button bsStyle="info" onClick={this.addForm} disabled={this.state.saving} block={true}><i className="fa fa-plus-square-o fa-2x"></i> Form</RB.Button>
    );
  }
});

module.exports = BPOAddForm;