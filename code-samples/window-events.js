import React from 'react';
import {State, Navigation} from 'react-router';
import Stores from '../../stores/stores.coffee';
import Store from '../../stores/store.coffee';
import DocumentStore from '../../stores/document-store.coffee';
import WorkspaceStore from '../../stores/workspace-store.coffee';
import ContainerComponent from '../editor/canvas/container-component.cjsx';
import PaginationComponent from '../review/pagination-component.cjsx';
import CreatorComponent from './creator-component.jsx';
import CommentsComponent from '../review/comments-component.cjsx';
import PositionHelper from '../mixins/position-mixin.coffee';
import InteractionMixin from '../mixins/interaction-mixin.coffee';
import Analytics from '../../lib/analytics.coffee';
import ForkOverlayComponent from './fork-overlay-component.jsx';
import LoginOverlayComponent from '../login/login-overlay-component.jsx';
import Utils from '../../utils.coffee';
import API from '../../api/api.coffee';
import SVGIcon from '../shared/svg-icon-component.cjsx';
import GestureRecogniser from '../shared/gesture-recogniser-component.jsx';

const classSet = React.addons.classSet;

// TODO: split this component up if possible

export default React.createClass({

  displayName: 'Share',

  mixins: [State, Navigation, PositionHelper, InteractionMixin],

  getInitialState() {
    let shareOptions = DocumentStore.getShareOptions(this.getParams().hashId).options;
    const showForkModal = this.getQuery().fork || false;
    const showComments = this.getQuery().comment || false;

    return {
      container: DocumentStore.currentContainer(),
      document: DocumentStore.currentDocument(),
      isCommentsResizing: false,
      isCommentsOpen: shareOptions.comment,
      shareOptions,
      showComments,
      showForkModal,
      showLoginModal: false,
      isAuthenticated: Boolean(Utils.getConfigVariable('USER_ID')),
      authenticatedAction: null,
      projects: Utils.getDocumentJSON('projects-json'),
    };
  },

  updateCurrentContainer() {
    this.setState({
      container: DocumentStore.currentContainer()
    });
  },

  componentWillMount() {
    Analytics.track(Analytics.REVIEWED_DESIGN, {});
    Stores.on(Store.CHANGE_EVENT, this.updateCurrentContainer);
  },

  componentDidMount() {
    window.addEventListener('resize', this.sizeContainer);
    this.sizeContainer();
    this.getDOMNode().focus();
    global.document.title = `${this.state.document.name} | Atomic`;
  },

  componentWillUnmount() {
    Stores.removeListener(Store.CHANGE_EVENT, this.updateCurrentContainer);
    window.removeEventListener('resize', this.sizeContainer);
  },

  componentDidUpdate() {
    this.sizeContainer();
    this.getDOMNode().focus();
  },

  renderComments() {
    if (this.state.isCommentsOpen && this.state.shareOptions.comment) {
      return (
        <CommentsComponent
          onStartResize={ this.onStartResize }
          container={ this.state.container }
          document={ this.state.document }
          onFocus={ this.onCommentFocus }
          shareHashId={ this.getParams().hashId }
          open={ this.state.showComments }
        />
      );
    }
  },

  renderForkModal() {
    if (this.state.showForkModal) {
      return <ForkOverlayComponent
        container={ DocumentStore.pageContainers()[0] }
        hashId={ this.getParams().hashId }
        onEditNow={ (documentSlug) => window.location = this.makeHref('editor', {documentSlug}) }
        onClose={ () => this.setState({showForkModal: false}) }
        projects={ this.state.projects }
      />;
    }
  },

  renderLoginModal() {
    if (this.state.showLoginModal) {

      return (
        <LoginOverlayComponent
          action={ this.state.authenticatedAction.name }
          onSuccess={ this.onAuthenticated }
          onClose={ () => this.setState({showLoginModal: false}) }
          path={ this.getPathname() } />
      );
    }
  },

  renderPagination() {
    let pageContainers = DocumentStore.pageContainers();
    let totalPages = pageContainers.length;

    if (totalPages > 1) {
      return <PaginationComponent container={ this.state.container } widthStyle={ this.getWidthStyle() }/>;
    }
  },

  getWidthStyle() {
    return {
      right: (this.state.isCommentsOpen ? WorkspaceStore.props().reviewCommentsWidth : 0) + 'px'
    };
  },

  render() {
    let classes = classSet({
      'review': true,
      'review--commentsOpen': this.state.isCommentsOpen,
      'review--resizing': this.state.isCommentsResizing,
    });

    let forkButton = this.state.shareOptions.fork &&
      <a href="#" onClick={ this.onFork } className="reviewNav-btn reviewNav-copy_and_edit"><SVGIcon name="edit" /> Copy &amp; Edit</a>;

    let commentVerb = this.state.isCommentsOpen ? 'Hide' : 'Show';
    let toggleCommentsButton = this.state.shareOptions.comment &&
      (<a href="#" onClick={ this.onToggleComments } className="reviewNav-btn reviewNav-comments--shared reviewNav-comments">
        <div className="reviewNav-commentsBubble">
          <div className="reviewNav-commentsBubble-bubble">{ DocumentStore.documentCommentCount() }</div>
          <SVGIcon name="comment-bubble-tip" />
        </div>
        { commentVerb } Comments
      </a>);

    // future work: remove 'display:none;' from _review-nav.scss
    let toggleHotspotVisiblityButton = (
      <a className="reviewNav-btn reviewNav-hotspots">
        <SVGIcon name="interactive" />
      </a>
    );

    return (
      <div
        className={ classes }
        onKeyDown={ this.handleKeyDown }
        onMouseMove={ this.onMouseMove }
        onMouseUp={ this.onMouseUp }
        tabIndex="0">

        <GestureRecogniser ref="containerWrapper" onGesture={this.handleGesture} style={this.getWidthStyle()} className="review-design" container={this.state.container}>
          <div className="bg"></div>
          <ContainerComponent container={this.state.container}
                              reviewMode={true}
                              ref="containerComponent" />
        </GestureRecogniser>

        { this.renderComments() }

        <div className="review-bar">
          <CreatorComponent user={ this.state.document.user }/>
          { this.renderPagination() }
          <div className="reviewNav">
            { toggleHotspotVisiblityButton }
            { forkButton }
            { toggleCommentsButton }
          </div>
        </div>

        <div className="intercom-button" style={ { display: "none" } } />

        { this.renderForkModal() }
        { this.renderLoginModal() }
      </div>
    );

  },

  onStartResize() {
    this.setState({
      isCommentsResizing: true
    });
  },

  onMouseMove(event) {
    if (this.state.isCommentsResizing) {
      let width = global.innerWidth - event.pageX;
      width = Utils.constrain(width, 252, 420);
      API.send('resizeCommentsPanel', width);
    }
  },

  onMouseUp() {
    if (this.state.isCommentsResizing) {
      this.setState({
        isCommentsResizing: false
      });
    }
  },

  handleKeyDown(event) {
    if (event.key === 'ArrowLeft') {
      this.cancelAnimation();
      API.send('previousPage');
      event.stopPropagation();
    } else if (event.key === 'ArrowRight') {
      this.cancelAnimation();
      API.send('nextPage');
      event.stopPropagation();
    }
  },

  onToggleComments(evt) {
    evt.preventDefault();
    this.setState({
      isCommentsOpen: !this.state.isCommentsOpen
    });
  },

  onFork(evt) {
    evt.preventDefault();

    let action = {
      name: 'fork',
      callback: () => this.setState({showForkModal: true})
    };

    if (this.state.isAuthenticated) {
      action.callback();
    } else {
      this.setState({
        showLoginModal: true,
        authenticatedAction: action
      });
    }
  },

  onCommentFocus() {
    if (!this.state.isAuthenticated) {
      // The user is not logged in, prompt login/register
      const showLoginModal = true;
      const authenticatedAction = { name: 'comment' };
      this.setState({ showLoginModal, authenticatedAction });
      return false;

    } else {
      // The user is logged in.
      return true;
    }
  },

  onAuthenticated(projects) {

    let action = this.state.authenticatedAction;

    this.setState({
      isAuthenticated: true,
      showLoginModal: false,
      authenticatedAction: null,
      projects: projects
    });

    if (action) {
      action.callback();
    }
  },

  sizeContainer() {
    this.centerAndScaleContainerInsideWrapper('containerComponent', 'containerWrapper');
  }

});
