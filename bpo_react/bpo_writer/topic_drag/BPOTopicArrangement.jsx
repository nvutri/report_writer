/**
 * BPO Report Topic List.
 */

var update = require('react-addons-update');

/**
 * BPO Topic List .
 * @export
 */
var BPOTopicArrangement = {

  /**
   * Update status of topic list to server.
   */
  serverMoveTopics: function () {
    if (this.state.saving) {
      return;
    }
    this.state.saving = true;
    var self = this;
    var topic_ids = self.state.topics.map(function (topic) {
      return topic.id;
    });
    $.ajax({
        url: './bpo_topic/swap_topic/',
        dataType: 'json',
        type: 'POST',
        data: {
          root: self.props.root,
          topic_id: self.props.id,
          subtopics: JSON.stringify(topic_ids)
        },
        success: function (topics) {
          self.setState({
            topics: topics,
            saving: false
          });
        }.bind(this)
      }
    );
  },

  /**
   * Synchronize removing topic from server.
   * @param removeTopicId
   */
  serverRemoveTopic: function (removeTopicId) {
    if (this.state.saving) {
      return;
    }
    this.state.saving = true;
    var self = this;
    $.ajax({
        url: './bpo_topic/remove_topic/',
        dataType: 'json',
        type: 'POST',
        data: {
          root: self.props.root,
          topic_id: self.props.id,
          remove_topic_id: removeTopicId
        },
        success: function (topics) {
          self.setState({
            topics: topics,
            saving: false
          });
        }.bind(this)
      }
    );
  },

  /**
   * Synchronize inserting topic to server.
   * @param insertTopicId
   */
  serverInsertTopic: function (insertTopicId) {
    if (this.state.saving) {
      return;
    }
    this.state.saving = true;
    var self = this;
    $.ajax({
        url: './bpo_topic/insert_topic/',
        dataType: 'json',
        type: 'POST',
        data: {
          root: self.props.root,
          topic_id: self.props.id,
          insert_topic_id: insertTopicId
        },
        success: function (topics) {
          self.setState({
            topics: topics,
            saving: false
          });
        }.bind(this)
      }
    );
  },
  /**
   * Drag drop moving the topic from dragIndex to hoverIndex.
   * @param dragIndex index of the dragged item.
   * @param dragId topicId of the dragged item.
   * @param hoverIndex index of the hovered over item.
   * @param hoverId topicId of the hovered over item.
   */
  moveTopic: function (dragIndex, dragId, hoverIndex) {
    if (this.state.saving) {
      return;
    }
    const topics = this.state.topics;
    const dragCard = topics[dragIndex];
    this.setState(update(this.state, {
      topics: {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, dragCard]
        ]
      }
    }));
    this.serverMoveTopics();
  },

  /**
   * Reset topic index.
   */
  resetIndex: function () {
    var newTopics = this.state.topics;
    for (var newIndex = 0; newIndex < newTopics.length; ++newIndex) {
      newTopics[newIndex] = update(newTopics[newIndex], {index: {$set: newIndex}});
    }
    this.setState({topics: newTopics});
  },

  /**
   * Insert topic to the topic list at the hoverIndex.
   * @param dragProps topic props of the dragged item.
   * @returns {boolean} if successfully inserted.
   */
  insertTopic: function (dragProps) {
    // Make sure hoverElement is the same.
    if (this.state.topics && this.state.topics.length > 0 && this.state.topics[0].id == dragProps.id) {
      return false;
    }
    console.log('Inserting ' + dragProps.title + ' --> ' + this.props.title);
    this.serverInsertTopic(dragProps.id);
    this.setState(update(this.state, {
      topics: {
        $splice: [[0, 0, dragProps]]
      }
    }));
    return true;
  },

  /**
   * Remove the topic at the located topic list.
   * @param dragId
   * @returns {boolean} if successfully removed.
   */
  removeTopic: function (dragId) {
    var self = this;
    var dragIndex = null;
    this.state.topics.map(function (topic, index) {
      if (topic && topic.id == dragId) {
        dragIndex = index;
      }
    });
    if (dragIndex != null) {
      console.log('Remove ' + dragIndex + ' ' + dragId + ' --> ' + this.props.title);
      if (dragId && self.state.topics[dragIndex].id == dragId) {
        self.setState(update(self.state, {
          topics: {
            $splice: [[dragIndex, 1]]
          }
        }));
        this.serverRemoveTopic(dragId);
        return true;
      }
    }
    return false;
  }
};

module.exports = BPOTopicArrangement;
