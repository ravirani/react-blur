'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var React = require('react/addons');
var stackBlurImage = require('../lib/StackBlur.js');

var ReactBlur = React.createClass({
  displayName: 'ReactBlur',

  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    img: React.PropTypes.string.isRequired,
    blurRadius: React.PropTypes.number,
    resizeInterval: React.PropTypes.number,
    className: React.PropTypes.string,
    children: React.PropTypes.any
  },

  getDefaultProps: function getDefaultProps() {
    return {
      blurRadius: 0,
      resizeInterval: 128
    };
  },

  componentDidMount: function componentDidMount() {
    var _this = this;

    var blurRadius = this.props.blurRadius;

    var container = React.findDOMNode(this);

    this.height = container.offsetHeight;
    this.width = container.offsetWidth;

    this.canvas = React.findDOMNode(this.refs.canvas);
    this.canvas.height = this.height;
    this.canvas.width = this.width;

    this.img = new Image();
    this.img.crossOrigin = 'Anonymous';
    this.img.onload = function () {
      stackBlurImage(_this.img, _this.canvas, blurRadius, _this.width, _this.height);
    };
    this.img.src = this.props.img;

    window.addEventListener('resize', this.resize);
  },

  componentWillUnmount: function componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  },

  resize: function resize() {
    var _this2 = this;

    var now = new Date().getTime();
    var deferTimer;
    var threshhold = this.props.resizeInterval;

    if (this.last && now < this.last + threshhold) {
      clearTimeout(deferTimer);
      deferTimer = setTimeout(function () {
        _this2.last = now;
        _this2.doResize();
      }, threshhold);
    } else {
      this.last = now;
      this.doResize();
    }
  },

  doResize: function doResize() {
    var container = React.findDOMNode(this);

    this.height = container.offsetHeight;
    this.width = container.offsetWidth;

    stackBlurImage(this.img, this.canvas, this.props.blurRadius, this.width, this.height);
  },

  componentWillUpdate: function componentWillUpdate(nextProps) {
    if (this.img.src !== nextProps.img) {
      this.img.src = nextProps.img;
    }
    stackBlurImage(this.img, this.canvas, nextProps.blurRadius, this.width, this.height);
  },

  render: function render() {
    var _props = this.props;
    var img = _props.img;
    var className = _props.className;
    var children = _props.children;

    var other = _objectWithoutProperties(_props, ['img', 'className', 'children']);

    var classes = 'react-blur';

    if (className) {
      classes += ' ' + className;
    }

    return React.createElement(
      'div',
      _extends({}, other, { className: classes, onClick: this.clickTest }),
      React.createElement('canvas', { className: 'react-blur-canvas', ref: 'canvas' }),
      children
    );
  }
});

module.exports = ReactBlur;
