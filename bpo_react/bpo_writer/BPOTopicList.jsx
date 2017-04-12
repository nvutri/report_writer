/**
 * BPO Report Topic List.
 */

var React = require('react');
var update = require('react-addons-update');
var DragDropContext = require('react-dnd').DragDropContext;
var HTML5Backend = require('react-dnd-html5-backend');

var DragSource = require('react-dnd').DragSource;
var DropTarget = require('react-dnd').DropTarget;

var BPOTopicDrag = require('./topic_drag/BPOTopicDrag.jsx');
var BPOTopic = require('./BPOTopic.jsx');
var BPOTopicArrangement = require('./topic_drag/BPOTopicArrangement.jsx');
var BPOTopicTool = require('./report_tools/BPOTopicTool.jsx');
var BPOTopicEdit = require('./report_tools/BPOTopicEdit.jsx');

/**
 * Create BPO list of topic navigation panel.
 * It could either be a panel list of subtopics.
 * Or a topic leading to a form.
 * @export
 */
var BPOTopicList = React.createClass({
  /**
   * Mix with Topic Arrangement to re-arrange order and sync server.
   */
  mixins: [BPOTopicArrangement, BPOTopicEdit],
  /**
   * Initial state specifying collapsing and topics.
   * @returns {{collapsed: (*|boolean), topics: Array, type: string, saving: boolean, loading: boolean}}
   */
  getInitialState: function () {
    return {
      collapsed: this.props.collapsed,
      topics: [],
      type: 'topic_list',
      saving: false,
      loading: false,
      rename: false,
      title: this.props.title,
      original_title: this.props.title
    }
  },
  /**
   * Load components from server.
   */
  loadComponents: function () {
    if (this.state.loading) {
      return;
    }
    this.state.loading = true;
    $.ajax({
        url: './bpo_topic/get_topic_list/',
        dataType: 'json',
        type: 'GET',
        data: {
          topic_ids: JSON.stringify(this.props.topic_ids)
        },
        success: function (topics) {
          this.setState({
            topics: topics,
            loading: false
          });
        }.bind(this)
      }
    );
  },
  /**
   * After component is updated, get the topic list again.
   */
  componentWillMount: function () {
    if (this.props.topic_ids.length > 0) {
      this.loadComponents();
    }
  },
  /**
   * Handle collapsing accordion on navigation tab.
   * Set collapsed to not collapsed and vice versa.
   */
  handleClick: function () {
    this.setState({
      collapsed: !this.state.collapsed
    })
  },
  renderListTitle: function () {
    return <a className={this.state.collapsed ? "collapsed": ""}
              role="button" data-toggle="collapse"
              onClick={this.handleClick}>
      {this.state.title}
      {this.props.editable ?
        <BPOTopicTool
          id={this.props.id}
          rename={this.rename}
          delete={this.delete}
          /> : ''
      }
    </a>
  },
  /**
   * Render Sub-Topic List or a Topic.
   * @returns {XML}
   */
  render: function () {
    var self = this;
    var style = {
      opacity: this.props.isOver ? 0.5 : 1,
      background: this.props.isOver && !this.props.root ? 'cyan' : ''
    };
    var topicListComponent = (
      <div className="panel-group" role="tablist" style={style}>
        <div className="panel panel-default">
          <div className="panel-heading" role="tab">
            <h4 className="panel-title">
              {this.state.rename ? this.renderRenameForm() : this.renderListTitle()}
            </h4>
          </div>
        </div>
        <div className={this.state.collapsed ? "panel-collapse collapse": "panel-collapse collapse in"}
             role="tabpanel">
          <div className="panel-body">
            <ul className="nav nav-tabs nav-stacked">
              {
                this.state.topics.map(function (topic, index) {
                  if (!topic) {
                    return;
                  } else if (topic.type === 'topic_list') {
                    // If there is subtopics, recursively create new elements.
                    return <BPOTopicList
                      index={index}
                      key={topic.id}
                      id={topic.id}
                      parent_id={self.props.id}
                      parent_title={self.props.title}
                      title={topic.title}
                      topic_ids={topic.subtopics}
                      moveTopic={self.moveTopic}
                      insertTopic={self.insertTopic}
                      removeTopic={self.removeTopic}
                      type="topic_list"
                      collapsed={true}
                      editable={self.props.editable}
                      />
                  } else {
                    // If not create BPOTopic button to enter form.
                    return <BPOTopic
                      index={index}
                      key={topic.id}
                      id={topic.id}
                      parent_id={self.props.id}
                      parent_title={self.props.title}
                      title={topic.title}
                      moveTopic={self.moveTopic}
                      insertTopic={self.insertTopic}
                      removeTopic={self.removeTopic}
                      type="topic"
                      initial_open={self.props.root && index == 0}
                      editable={self.props.editable}
                      />
                  }
                })
              }
            </ul>
          </div>
        </div>
      </div>
    );
    topicListComponent = this.props.connectDragSource(
      this.props.connectDropTarget(topicListComponent)
    );
    return topicListComponent;
  }
});


BPOTopicList = DropTarget('Topic', BPOTopicDrag.TopicTarget, BPOTopicDrag.CollectTarget)(BPOTopicList);
BPOTopicList = DragSource('Topic', BPOTopicDrag.TopicSource, BPOTopicDrag.CollectSource)(BPOTopicList);
module.exports = DragDropContext(HTML5Backend)(BPOTopicList);
