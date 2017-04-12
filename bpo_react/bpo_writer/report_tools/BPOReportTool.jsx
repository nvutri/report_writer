/**
 * Handle main creation of a BPO Report.
 * @export
 */

var React = require('react');
var BPOAddTopicList = require('./BPOAddTopicList.jsx');
var BPOAddForm = require('./BPOAddForm.jsx');

/**
 * BPO Report Tool for modifying Report Topic list and form.
 * @export
 */
var BPOReportTool = React.createClass({
  render: function () {
    return (
      <div>
        <div className="row">
          <div className="col-md-6">
            <BPOAddTopicList report_id={this.props.report_id}/>
          </div>
          <div className="col-md-6">
            <BPOAddForm report_id={this.props.report_id}/>
          </div>
        </div>
      </div>
    )
  }
});

module.exports = BPOReportTool;
