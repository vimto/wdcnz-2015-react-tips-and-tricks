import React, {PropTypes} from 'react';
import StoreMixin from './store-mixin';

const UserProfilePage = React.createClass({

  mixins: [StoreMixin(UserStore)],

  propTypes: {
    userId: PropTypes.number.isRequired
  },

  getStateFromStores(props) {
    return {
      user: UserStore.get(props.userId);
    }
  },

  render() {
    const user = this.state.user;
    return (
      <div>
        { user ? user.name : 'Loading...' }
      </div>
    );
  }

});
