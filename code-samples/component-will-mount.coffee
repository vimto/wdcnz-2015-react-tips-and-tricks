log                 = require('debug')('ReviewShareOverlyComponent')
React               = require('react')
WorkspaceStore      = require('../../../stores/workspace-store.coffee')
DocumentStore       = require('../../../stores/document-store.coffee')
API                 = require('../../../api/api.coffee')
Utils               = require('../../../utils.coffee')
Router              = require('react-router')
ZeroClipboard       = require('zeroclipboard')


# TODO: We should re-factor this into a generic Modal component.
ReviewShareComponent = React.createClass
  displayName: 'ReviewShare'

  mixins: [Router.Navigation]

  getInitialState: ->
    isReadyToCopy: false
    isCopied: false
    sharingOptions:
      comment: true
      fork: false

  getReviewUrl: ->
    hashId = DocumentStore.getShareHashId(@state.sharingOptions)
    Utils.getDomain() + @makeHref('share', { hashId: hashId })

  refocusAndSelectUrl: ->
    reviewURLInput = @refs.reviewURLInput.getDOMNode()
    reviewURLInput.focus()
    reviewURLInput.select()

  componentWillMount: ->
    ZeroClipboard.config( { swfPath: '/images/ZeroClipboard.swf' } )

  componentDidMount: ->
    @clipboard = new ZeroClipboard(@refs.copyButton.getDOMNode())

    @clipboard.on 'ready', =>
      return unless @isMounted()
      @setState { isReadyToCopy: true }

      @clipboard.on 'copy', (event) =>
        return unless @isMounted()
        event.clipboardData.setData('text/plain', @getReviewUrl())

      @clipboard.on 'aftercopy', (event) =>
        return unless @isMounted()
        @setState { isCopied: true }
        @refocusAndSelectUrl()

      @clipboard.on 'error', (event) =>
        console.error 'ZeroClipboard error of type "' + event.name + '": ' + event.message
        ZeroClipboard.destroy()

    @refocusAndSelectUrl()

  componentDidUpdate: (prevProps, prevState) ->
    @refocusAndSelectUrl()

  componentWillUnmount: ->
    @clipboard = null
    # NOTE: this will destroy all clipboard buttons in the DOM!
    ZeroClipboard.destroy()

  onOptionChange: (option) ->
    opts = this.state.sharingOptions
    opts[option] = !opts[option]
    this.setState({
      sharingOptions: opts
    })

    # always reset the copy button UI when the share link options change
    @setState { isCopied: false }


  # TODO: onKeyDown doesn't bubble when you click the header or footer
  # of the modal, escape only works when you are focused on the input.
  render: ->

    copyButtonClass = React.addons.classSet({
      'btn': true
      'btn-copy': true
      'btn-disabled': !@state.isReadyToCopy
      'is-copied': @state.isCopied
    })

    <div  className='modal modal-share'
          onClick={ @closeModal }
          onKeyDown={ @handleKeyDown }>
      <div  className="modal-dialog"
            ref='reviewModalDialog'
            onClick={ (e) -> e.stopPropagation() }>
        <div className="modal-content">
          <div className="modal-header">
            <button type="button"
                    className="modal-close"
                    onClick={ @closeModal }>&times;</button>
            <h4 className="modal-title">
              Share a link to this design
            </h4>
          </div>
          <div className="modal-body">
            <p>
              <input type="text" ref='reviewURLInput' readOnly value={ @getReviewUrl() }></input>
              <button ref="copyButton" type="button" className={copyButtonClass}>{ if @state.isCopied then '✔ copied' else 'copy' }</button>
            </p>
            <p>
              <input type="checkbox" id="comment" onChange={ => @onOptionChange('comment') } checked={@state.sharingOptions.comment}/>
              <label htmlFor="comment">Let others leave comments</label>
              <input type="checkbox" id="fork" onChange={ => @onOptionChange('fork') } checked={@state.sharingOptions.fork}/>
              <label htmlFor="fork">Let others make a copy</label>
            </p>
            <p>Note: People you share this link with will always see the latest versions of all pages within your design.</p>
          </div>
        </div>
      </div>
    </div>

  handleKeyDown: (event) ->
    if event.keyCode == 27
      @closeModal(event)

  closeModal: (event) ->
    event.preventDefault()
    API.send('toggleReviewShareModal')


module.exports = ReviewShareComponent
