var MenuComponent = React.createClass({
  displayName: 'MenuComponent',


  getInitialState: function () {
    return {
      data: []
    };
  },

  fetchData: function (dataset) {
    var dataUrl = '/' + dataset;
    $.ajax({
      type: 'GET',
      url: dataUrl,
      dataType: 'json',
      success: function (result) {
        this.setState({ data: result });
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(dataUrl, status, err.toString());
      }
    });
  },

  componentDidMount() {
    this.fetchData('Iris');
  },

  render: function () {
    var menuTitles = ['Iris', 'MPG'];
    var menuItems = menuTitles.map(function (item, index) {
      return React.createElement(
        'button',
        { value: item, onClick: () => this.fetchData(item), key: 'menuButton:' + index, className: 'w3-bar-item w3-button w3-padding' },
        React.createElement('i', { key: index, className: 'fa fa-users fa-fw' }),
        item
      );
    }.bind(this));
    return React.createElement(
      'div',
      { 'class': 'w3-bar-block' },
      React.createElement(
        'button',
        { href: '#', className: 'w3-bar-item w3-button w3-padding w3-blue' },
        React.createElement('i', { className: 'fa fa-users fa-fw' }),
        'Menu'
      ),
      menuItems
    );
  }
});

var Menu = React.render(React.createElement(MenuComponent, null), document.getElementById('menuItems'));
