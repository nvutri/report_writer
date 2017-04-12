/**
 * Handle editing modal.
 * @export
 */

var React = require('react');
var RB = require('react-bootstrap');

/**
 * BPO Edit button to trigger edit modal.
 */
var BPOEditModal = React.createClass({
  getInitialState: function () {
    return {
      showModal: false,
      saving: false,
      topics: []
    }
  },
  /**
   * Reload page upon success.
   */
  reload: function () {
    window.location = './';
  },
  openModal: function () {
    $.ajax({
      url: './bpo_report/edit_topic/',
      dataType: 'json',
      type: 'GET',
      data: {
        report_id: this.props.report_id
      },
      success: function (topics) {
        this.setState({
          showModal: true,
          topics: topics
        });
      }.bind(this)
    });
  },
  closeModal: function () {
    this.setState({showModal: false});
    this.reload();
  },
  render: function () {
    return (
      <div>
        <RB.Button bsStyle="warning" onClick={this.openModal} disabled={this.state.saving} block={true}>
          Edit Report
        </RB.Button>
        <RB.Modal show={this.state.showModal} onHide={this.closeModal}>
          <RB.Modal.Body>
          </RB.Modal.Body>
          <RB.Modal.Footer>
            <RB.Button onClick={this.closeModal}>Close</RB.Button>
          </RB.Modal.Footer>
        </RB.Modal>
      </div>
    );
  }
});

module.exports = BPOEditModal;