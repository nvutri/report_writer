/**
 * BPO Report Topic Creation.
 */

var React = require('react');
var ReactDOM = require('react-dom');
var DragSource = require('react-dnd').DragSource;
var DropTarget = require('react-dnd').DropTarget;
var RB = require('react-bootstrap');

var BPOForm = require('./BPOForm.jsx');
var BPOTopicDrag = require('./topic_drag/BPOTopicDrag.jsx');
var BPOTopicTool = require('./report_tools/BPOTopicTool.jsx');
var BPOTopicEdit = require('./report_tools/BPOTopicEdit.jsx');

/**
 * Create one single BPO Topic Entry.
 */
var BPOTopic = React.createClass({
  mixins: [BPOTopicEdit],
  getInitialState: function () {
    return {
      rename: false,
      title: this.props.title,
      original_title: this.props.title,
      saving: false
    }
  },
  /**
   * Handle Topic tab on clicked.
   * Load related form.
   */
  handleClick: function () {
    // Un-mount before mounting the form in place.
    ReactDOM.unmountComponentAtNode(document.getElementById('bpo-report-form'));
    var self = this;
    $.ajax({
        url: './bpo_topic/get_topic/',
        dataType: 'json',
        type: 'GET',
        data: {
          topic_id: this.props.id
        },
        success: function (topic) {
          ReactDOM.render(
            <BPOForm
              field_ids={topic.fields}
              title={topic.title}
              topic_id={topic.id}
              row_ids={topic.row_ids}
              editable={self.props.editable}
              />,
            document.getElementById('bpo-report-form')
          );
        }
      }
    );
  },
  /**
   * Trigger after mounting topic is done.
   */
  componentDidMount: function () {
    if (this.props.initial_open) {
      this.handleClick();
    }
  },
  render: function () {
    const liOpacity = this.props.isDragging ? 0 : 1;
    if (this.state.rename) {
      return <li role="presentation">
        {this.renderRenameForm()}
      </li>;
    } else {
      return this.props.connectDragSource(
        this.props.connectDropTarget(
          <li role="presentation" style={{opacity: liOpacity}}>
            <a role="tab" onClick={this.handleClick}>
              {this.state.title}
              {this.props.editable ?
                <BPOTopicTool
                  id={this.props.id}
                  rename={this.rename}
                  delete={this.delete}
                  /> : ''
              }
            </a>
          </li>
        )
      )
    }
  }
});

BPOTopic = DropTarget('Topic', BPOTopicDrag.TopicTarget, BPOTopicDrag.CollectTarget)(BPOTopic);
module.exports = DragSource('Topic', BPOTopicDrag.TopicSource, BPOTopicDrag.CollectSource)(BPOTopic);
