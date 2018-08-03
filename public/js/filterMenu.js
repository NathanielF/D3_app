'use strict';

var MenuComponent = React.createClass({
  displayName: 'MenuComponent',


  getInitialState: function getInitialState() {
    return {
      data: []
    };
  },

  fetchData: function fetchData() {
    $.ajax({
      type: 'GET',
      url: '/data',
      dataType: 'json',
      success: function (result) {
        this.setState({ data: result });
      }.bind(this),
      error: function (xhr, status, err) {
        console.error("/data", status, err.toString());
      }.bind(this)
    });
  },

  componentDidMount: function componentDidMount() {
    this.fetchData();
  },


  render: function render() {
    return React.createElement(
      'div',
      { 'class': 'w3-bar-block' },
      React.createElement(
        'a',
        { href: '#', className: 'w3-bar-item w3-button w3-padding w3-blue' },
        React.createElement('i', { className: 'fa fa-users fa-fw' }),
        '\xA0 Overview'
      ),
      React.createElement(
        'a',
        { href: '#', className: 'w3-bar-item w3-button w3-padding' },
        React.createElement('i', { className: 'fa fa-eye fa-fw' }),
        '\xA0 Views'
      ),
      React.createElement(
        'a',
        { href: '#', className: 'w3-bar-item w3-button w3-padding' },
        React.createElement('i', { className: 'fa fa-users fa-fw' }),
        '\xA0 Traffic'
      ),
      React.createElement(
        'a',
        { href: '#', className: 'w3-bar-item w3-button w3-padding' },
        React.createElement('i', { className: 'fa fa-bullseye fa-fw' }),
        '\xA0 Geo'
      ),
      React.createElement(
        'a',
        { href: '#', className: 'w3-bar-item w3-button w3-padding' },
        React.createElement('i', { className: 'fa fa-diamond fa-fw' }),
        '\xA0 Orders'
      ),
      React.createElement(
        'a',
        { href: '#', className: 'w3-bar-item w3-button w3-padding' },
        React.createElement('i', { className: 'fa fa-bell fa-fw' }),
        '\xA0 News'
      ),
      React.createElement(
        'a',
        { href: '#', className: 'w3-bar-item w3-button w3-padding' },
        React.createElement('i', { className: 'fa fa-bank fa-fw' }),
        '\xA0 General'
      ),
      React.createElement(
        'a',
        { href: '#', className: 'w3-bar-item w3-button w3-padding' },
        React.createElement('i', { className: 'fa fa-history fa-fw' }),
        '\xA0 History'
      ),
      React.createElement(
        'a',
        { href: '#', className: 'w3-bar-item w3-button w3-padding' },
        React.createElement('i', { className: 'fa fa-cog fa-fw' }),
        '\xA0 Settings'
      )
    );
  }
});

var MenuComponent = ReactDOM.render(React.createElement(MenuComponent, null), document.getElementById('menuItems'));
