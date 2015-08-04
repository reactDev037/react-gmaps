"use strict";

jest.dontMock("../listener");
jest.dontMock("../infoWindow");

describe("InfoWindow", function () {

  var React = require("react/addons");
  var TestUtils = React.addons.TestUtils;
  var InfoWindow = require("../infoWindow");

  var infoWindow = undefined;

  beforeEach(function () {
    window.google = {
      maps: {
        InfoWindow: jest.genMockFunction(),
        LatLng: jest.genMockFunction(),
        event: {
          addListener: jest.genMockFunction(),
          removeListener: jest.genMockFunction()
        }
      }
    };
    infoWindow = TestUtils.renderIntoDocument(React.createElement(InfoWindow, { onCloseClick: jest.genMockFunction(), content: "<h1>InfoWindow</h1>" }));
  });

  it("creates a infoWindow", function () {
    expect(window.google.maps.InfoWindow).toBeCalled();
  });

  it("creates a infoWindow once", function () {
    infoWindow.render();
    expect(window.google.maps.InfoWindow.mock.calls.length).toBe(1);
  });

  it("binds events", function () {
    expect(window.google.maps.event.addListener).toBeCalled();
  });

  it("unbinds events", function () {
    infoWindow.componentWillUnmount();
    expect(window.google.maps.event.removeListener).toBeCalled();
  });

  it("calls `setOptions` when receive new props", function () {
    window.google.maps.InfoWindow = function () {
      return {
        setOptions: jest.genMockFunction()
      };
    };
    var Parent = React.createClass({
      displayName: "Parent",

      getInitialState: function getInitialState() {
        return {
          content: "1"
        };
      },
      render: function render() {
        return React.createElement(InfoWindow, { ref: "child", content: this.state.testState });
      }
    });
    var parent = TestUtils.renderIntoDocument(React.createElement(Parent, null));
    parent.setState({
      content: "2"
    });
    expect(parent.refs.child.infoWindow.setOptions).toBeCalled();
  });
});