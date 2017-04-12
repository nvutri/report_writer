/** @jsx React.DOM */
var React = require('react');
var ReactDOM = require('react-dom');
var BPOReport = require('./BPOReport.jsx');

// Render the BPO Report given its template.
var RenderMainApp = {
  initialize: function () {
    var reportID = document.getElementById('bpo_report_id').value;
    ReactDOM.unmountComponentAtNode(document.getElementById('react-app'));
    ReactDOM.render(
      <BPOReport report_id={reportID}/>,
      document.getElementById('react-app')
    );
  }
};

RenderMainApp.initialize();