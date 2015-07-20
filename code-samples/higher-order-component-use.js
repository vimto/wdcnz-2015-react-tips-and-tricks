import React, {PropTypes} from 'react';
import connectToStores from './connect-to-stores';

var ProfilePage = React.createClass({

  propTypes: {
    userId: PropTypes.number.isRequired,
    user: PropTypes.object // note that user is now a prop
  },

  render() {
    const user = this.props.user; // get user from props
    return <div>{user ? user.name : 'Loading'}</div>;
  }
});

// Now wrap ProfilePage using a higher-order component:
ProfilePage = connectToStores(ProfilePage, [UserStore], props => ({
  user: UserStore.get(props.userId)
});
