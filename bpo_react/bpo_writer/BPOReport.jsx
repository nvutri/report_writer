/**
 * Handle main creation of a BPO Report.
 * @export
 */

var React = require('react');
var ReactDOM = require('react-dom');
var BPOReportTool = require('./report_tools/BPOReportTool.jsx');
var BPOTopicList = require('./BPOTopicList.jsx');
var BPOTopicArrangement = require('./topic_drag/BPOTopicArrangement.jsx');

var DragDropContext = require('react-dnd').DragDropContext;
var HTML5Backend = require('react-dnd-html5-backend');
var InputSwitch = require('react-input-switch');
/**
 * BPO Report App.
 * @export
 */
var BPOReport = React.createClass({
  getInitialState: function () {
    return {
      template: null,
      title: null,
      id: null,
      topic_ids: [],
      editable: false
    }
  },
  /**
   * Waiting on return BPO Report to start the render.
   */
  componentDidMount: function () {
    this.loadComponents();
  },
  /**
   * Load components from backend to sync.
   */
  loadComponents: function () {
    $.ajax({
      url: './bpo_report/get_report/',
      dataType: 'json',
      type: 'GET',
      data: {
        report_id: this.props.report_id
      },
      success: function (bpoReport) {
        this.setState({
          key: bpoReport.id,
          id: bpoReport.id,
          topic_ids: bpoReport.topics,
          template: bpoReport.template,
          title: bpoReport.title
        });
      }.bind(this)
    });
  },

  /**
   * Alternate switch state with editable.
   */
  onSwitchChange: function () {
    this.setState({editable: !this.state.editable});
  },

  /**
   * Render the whole report with topic list on the left and form on the right.
   * @returns {XML}
   */
  render: function () {
    // Wait for AJAX response.
    if (!this.state.title) {
      return <div></div>
    }
    return (
      <div className="row">
        <div className="col-md-3">
          <BPOTopicList
            topic_ids={this.state.topic_ids}
            title={this.state.title}
            collapsed={false}
            id={this.state.id}
            root={true}
            editable={this.state.editable}
            type="topic_list"
            />
          {this.state.editable ? <BPOReportTool report_id={this.state.id}/> : ''}
          <div style={style.input_switch}>
            <InputSwitch
              checked={this.state.editable}
              onChange={this.onSwitchChange}
              />
          </div>
        </div>
        <div className="col-md-9">
          <div id="bpo-report-form" style={style.bpo_form}>
          </div>
        </div>
      </div>
    )
  }
});
var style = {
  input_switch: {
    margin: 20
  },
  bpo_form: {
    marginRight: 20
  }
};
module.exports = DragDropContext(HTML5Backend)(BPOReport);
