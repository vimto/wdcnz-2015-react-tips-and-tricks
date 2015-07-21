import React, {PropTypes} from 'react';
import SVGIcon from '../../../shared/svg-icon-component.cjsx';
import {actions} from '../../../../flux';
import {isValidEmail} from '../../../../utils';

export default React.createClass({

  displayName: 'AddCollaboratorOverlay',

  propTypes: {
    projectId: PropTypes.number.isRequired
  },

  getInitialState() {
    return {
      email: '',
      message: ''
    };
  },

  render() {

    return (
      <div className="modal c_add_collaborator">
        <div className="modal-dialog" onClick={ e => e.stopPropagation() }>
          <div className="modal-content c_add_collaborator-content">

            <div className="modal-header">
              <button type="button" className="modal-close" onClick={ this.onClose }>&times;</button>
            </div>

            <div className="modal-body">
              <SVGIcon name="happy-share-faces"/>

              <h3 className="c_add_collaborator-heading">Invite someone to collaborate<br/>with you on this project</h3>

              <input type="email" className="c_add_collaborator-email" placeholder="Enter email address"
                     value={ this.state.email }
                     onChange={ e => this.setState({email: e.target.value}) }/>
              <textarea placeholder="A personal message (optional)" className="c_add_collaborator-message"
                        onChange={ e => this.setState({message: e.target.value}) }
                        value={ this.state.message }/>
            </div>

            <div className="modal-footer">
              <button type="button" className="no_ui c_add_collaborator-send btn btn--full" onClick={ this.sendInvite }>
                <SVGIcon name="paper-plane"/>
                Send Invite
              </button>
              <p className="c_add_collaborator-hint">Note: People you invite will be able to edit and <br />share
                designs just like you can.</p>
            </div>

          </div>
        </div>
      </div>

    );
  },

  sendInvite() {
    const email = this.state.email.trim();
    if (!isValidEmail(email)) {
      return this.handleInvalidEmail();
    }
    actions.addCollaborator(this.props.projectId, email, this.state.message);
  },

  onClose() {
    actions.dismissAddCollaboratorModal();
  },

  handleInvalidEmail() {
    const type = 'error';
    const message = 'Invalid email address';
    const timeout = 3000;
    actions.notifyUser({ type, message, timeout });
  }

});
