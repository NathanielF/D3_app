
var MenuComponent = React.createClass({
  displayName: 'MenuComponent',


  getInitialState: function () {
    return {
      data: []
    };
  },

  fetchData: function () {
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

  componentDidMount() {
    this.fetchData();
  },

  render: function () {
    var menuTitles = ["Iris", "MPG"];
    var menuItems = menuTitles.map(function (item, index) {
      return React.createElement(
        'a',
        { key: index, href: '#', className: 'w3-bar-item w3-button w3-padding' },
        React.createElement('i', { key: index, className: 'fa fa-users fa-fw' }),
        '\xA0',
        item
      );
    });
    return React.createElement(
      'div',
      { 'class': 'w3-bar-block' },
      React.createElement(
        'a',
        { href: '#', className: 'w3-bar-item w3-button w3-padding w3-blue' },
        React.createElement('i', { className: 'fa fa-users fa-fw' }),
        '\xA0 Overview'
      ),
      menuItems
    );
  }
});

var MenuComponent = ReactDOM.render(React.createElement(MenuComponent, null), document.getElementById('menuItems'));
