import React from 'react';

export default React.createClass({

  displayName: 'ProjectSettings',

  getInitialState() {
    return { open: false };
  },

  renameProject(event) {
    // Code to rename Project...
  },

  archiveProject(event) {
    // Code to archive Project...
  },

  openDropdown(event) {
    event.preventDefault();
    this.setState({ open: true });
  },

  renderItems() {
    return (
      <ul className="dropdown-items">
        <li><a onClick={ this.renameProject }>Rename</a></li>
        <li><a onClick={ this.archiveProject }>Archive</a></li>
      </ul>
    );
  },

  renderOpen() {
    return (
      <div className="hub-project-settings open">
        <div className="dropdown">
          { this.renderItems() }
        </div>
      </div>
    );
  },

  renderClosed() {
    return (
      <div className="hub-project-settings" onClick={ this.openDropdown } title="Project settings" />
    );
  },

  render() {
    if (this.state.open) {
      { this.renderOpen() }
    } else {
      { this.renderClosed() }
    }
  }

});
