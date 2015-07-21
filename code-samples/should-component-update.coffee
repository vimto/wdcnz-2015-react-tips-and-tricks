React            = require('react')
ColorSpaceCanvas = require('color-space-canvas')

HSVColorFieldComponent = React.createClass
  displayName: 'HSVColorField'

  componentDidMount: ->
    hsvProps =
      colorSpace:  @props.colorSpace
      colorValues: @props.hsva
      axes:        @props.axes

    @hsv = new ColorSpaceCanvas(hsvProps, @getDOMNode())

  shouldComponentUpdate: (nextProps) ->
    if nextProps.width != @props.width or nextProps.height != @props.height
      return true

    # Hue bar never needs to update if hsva changes , this may hnage later if we let people swap color axes in the UI
    if @props.axes == 'h'
      return false

    # Only render if the sv values have changed
    if @props.axes == 'sv'
      if nextProps.hsva[0] == @props.hsva[0]
        return false

    return true

  render: ->

    if @isMounted()
      @hsv.setProps colorValues: @props.hsva

    className = @props.axes + '-color-field'
    if @props.className
      className += ' ' + @props.className

    <canvas className={className} width={@props.width} height={@props.height} />

module.exports = HSVColorFieldComponent
