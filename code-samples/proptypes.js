import React, {PropTypes} from 'react';
import SVGIcon from '../../shared/svg-icon-component.cjsx';
import Avatar from '../../profile/avatar.jsx'

const classSet = React.addons.classSet;

export default React.createClass({

  displayName: 'PageLockIndicator',

  propTypes: {
    member: PropTypes.shape({
      email: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired
    }).isRequired,
    minimal: PropTypes.bool
  },

  getDefaultProps() {
    return {
      minimal: false
    };
  },

  render() {
    const classes = classSet({
      'c-page_lock_indicator': true,
      'c-page_lock_indicator--is_minimal': this.props.minimal
    });

    const title = this.props.member.name + ' (' + this.props.member.email + ')';

    let text;
    if (!this.props.minimal) {
      text = (
        <div className="c-page_lock_indicator--text">
          <p>{this.props.member.name} is working on this page</p>
          <p>This page is locked, but can be duplicated</p>
        </div>
      );
    }

    let user = {
      name: this.props.member.name,
      avatarURL: this.props.member.avatarURL
    }

    return (
      <div className={classes}>
        <div>
          <div className="c-page_lock_indicator--badge" title={title}>
            <Avatar size="large" user={ user }/>
            <SVGIcon name="page-lock"/>
          </div>
          {text}
        </div>
      </div>
    );
  }


});
