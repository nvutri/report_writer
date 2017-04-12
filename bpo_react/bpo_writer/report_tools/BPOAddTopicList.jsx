/**
 * Handle adding new topic list.
 * @export
 */

var React = require('react');
var RB = require('react-bootstrap');

var BPOAddTopicList = React.createClass({
  DEFAULT_TITLE: 'New Topic List',
  getInitialState: function () {
    return {
      saving: false
    }
  },

  /**
   * Add Topic List to backend server.
   * Reload the whole topic list upon success.
   */
  addTopicList: function () {
    if (this.state.saving) {
      return;
    }
    // Disable saving more.
    this.setState({saving: true});
    $.ajax({
        url: './bpo_report/create_topic_list/',
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
      <RB.Button bsStyle="info" onClick={this.addTopicList} disabled={this.state.saving} block={true}>
        <i className="fa fa-plus-square-o fa-2x"></i> List
      </RB.Button>
    );
  }
});

module.exports = BPOAddTopicList;