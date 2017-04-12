/**
 * BPO Report Topic Edit.
 */

var React = require('react');
var RB = require('react-bootstrap');

/**
 * Create one single BPO Topic Entry.
 */
var BPOTopicEdit = {

  /**
   * On input changing title. Set the value.
   * @param e
   */
  handleTitleChange: function (e) {
    this.setState({
      title: e.target.value
    })
  },
  /**
   * Set the state to renaming.
   */
  rename: function () {
    this.setState({
      rename: true
    });
  },
  /**
   * Deleting this topic at server side.
   * Reload at finish.
   */
  delete: function () {
    this.setState({saving: true});
    $.ajax({
      url: './bpo_topic/delete_topic/',
      dataType: 'json',
      type: 'POST',
      data: {
        topic_id: this.props.id,
        parent_id: this.props.parent_id
      },
      success: function () {
        window.location = './';
      }
    });
  },
  /**
   * Cancel renaming state.
   */
  cancelRename: function (e) {
    this.setState({
      rename: false,
      title: this.state.original_title
    })
  },
  /**
   * Submit topic rename to server for sync.
   */
  submitRenameTopic: function () {
    var self = this;
    this.setState({saving: true});
    $.ajax({
      url: './bpo_topic/rename_topic/',
      dataType: 'json',
      type: 'POST',
      data: {
        topic_id: this.props.id,
        new_title: this.state.title
      },
      success: function () {
        self.setState({
          saving: false,
          rename: false,
          original_title: self.state.title
        })
      }
    });
  },
  /**
   * Render form that shows renaming input submission
   * @returns {XML}
   */
  renderRenameForm: function () {
    const buttonStyle = {marginTop: 0};
    return (
      <form>
        <RB.Row>
          <RB.Col xs={6}>
            <RB.Input className="form-control" type="text" value={this.state.title}
                      onChange={this.handleTitleChange} disabled={this.state.saving}/>
          </RB.Col>
          <RB.Col xs={6}>
            <RB.ButtonToolbar>
              <RB.Button bsStyle="success" type="button" bsSize="xsmall" style={buttonStyle}
                         onClick={this.submitRenameTopic} disabled={this.state.saving}>
                <i className="fa fa-check fa-2x"></i>
              </RB.Button>
              <RB.Button bsStyle="default" type="reset" bsSize="xsmall" style={buttonStyle}
                         onClick={this.cancelRename} disabled={this.state.saving}>
                <i className="fa fa-ban fa-2x"></i>
              </RB.Button>
            </RB.ButtonToolbar>
          </RB.Col>
        </RB.Row>
      </form>
    )
  }
};

module.exports = BPOTopicEdit;
