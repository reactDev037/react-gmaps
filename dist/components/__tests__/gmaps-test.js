'use strict';

jest.dontMock('../listener');
jest.dontMock('../gmaps');

describe('Gmaps', function () {

  var React = require('react/addons');
  var TestUtils = React.addons.TestUtils;
  var Gmaps = require('../gmaps');

  var gmaps = undefined;

  var width = '100%';
  var height = '100%';
  var style = {
    backgroundColor: 'black'
  };
  var className = 'className';
  var onMapCreated = jest.genMockFunction();

  beforeEach(function () {
    delete window.google;
    var Child = React.createClass({
      displayName: 'Child',

      render: function render() {
        return null;
      }
    });
    gmaps = TestUtils.renderIntoDocument(React.createElement(
      Gmaps,
      {
        width: width,
        height: height,
        style: style,
        className: className,
        onMapCreated: onMapCreated,
        onClick: jest.genMockFunction() },
      React.createElement(Child, null)
    ));
    window.google = {
      maps: {
        Map: jest.genMockFunction(),
        LatLng: jest.genMockFunction(),
        event: {
          addListener: jest.genMockFunction(),
          removeListener: jest.genMockFunction()
        }
      }
    };
    window.mapsCallback();
  });

  it('applies the style', function () {
    var node = gmaps.getDOMNode();
    expect(node.style.width).toBe(width);
    expect(node.style.height).toBe(height);
    expect(node.style.backgroundColor).toBe(style.backgroundColor);
  });

  it('applies the class name', function () {
    expect(gmaps.getDOMNode().className).toBe(className);
  });

  it('loads maps once', function () {
    gmaps.componentDidMount();
    expect(window.mapsCallback).not.toBeDefined();
  });

  it('creates a map', function () {
    expect(gmaps.getMap()).not.toBe(null);
  });

  it('calls `onMapCreated`', function () {
    expect(onMapCreated).toBeCalled();
  });

  it('clones children with map', function () {
    expect(gmaps.getChildren()['.0'].props.map).toBeDefined();
  });

  it('binds events', function () {
    expect(window.google.maps.event.addListener).toBeCalled();
  });

  it('unbinds events', function () {
    gmaps.componentWillUnmount();
    expect(window.google.maps.event.removeListener).toBeCalled();
  });
});