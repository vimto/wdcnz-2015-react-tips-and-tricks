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

  shouldComponentUpdate: (nextProps, nextState) ->
    if nextProps.width == @props.width and nextProps.height == @props.height
      return false


  render: ->

    if @isMounted()
      @hsv.setProps colorValues: @props.hsva

    className = @props.axes + '-color-field'
    if @props.className
      className += ' ' + @props.className

    <canvas className={className} width={@props.width} height={@props.height} />

module.exports = HSVColorFieldComponent
