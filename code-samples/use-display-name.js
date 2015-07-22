import React, {PropTypes} from 'react';

export default React.createClass({

  displayName: 'AppNotification',

  propTypes: {
    type: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired
  },

  render() {


    let classes = {};
    classes['app_notification'] = true;
    classes[`app_notification--${this.props.type}`] = true;
    classes = React.addons.classSet(classes);

    return (
      <div className={classes}>
        <span className="app_notification-message">
          { this.renderMessage() }
        </span>
      </div>
    );
  },

  renderMessage() {
    if (this.props.type === 'reload') {
      return [this.props.message, <a href="#" onClick={this.handleReload}>Refresh now.</a>];
    }

    return this.props.message;
  },

  handleReload() {
    window.location.reload();
  }
});
