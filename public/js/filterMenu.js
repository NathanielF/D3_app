/* eslint-disable no-unused-vars */
/* global React data */

var TableComponent = React.createClass({
  displayName: 'TableComponent',


  getInitialState: function () {
    return {
      data: data.observations
    };
  },

  getSelectedData: function (data) {
    this.setState({ data: data });
  },

  makeTable: function (data) {
    var colnames = data.length > 0 ? Object.keys(data[1]) : [];
    var headers = colnames.map((val, index) => React.createElement(
      'th',
      null,
      val
    ));
    var rows = data.map((row, index) => {
      var vals = Object.keys(row);
      var details = vals.map((str, indx) => React.createElement(
        'td',
        { key: 'Table' + index + row[str] },
        row[str]
      ));
      return React.createElement(
        'tr',
        { key: 'Row' + index },
        details
      );
    });
    const Table = data = React.createElement(
      'table',
      { key: 'Main Table', id: 'MainTable',
        className: 'w3-table w3-striped w3-bordered w3-border w3-hoverable w3-white' },
      headers,
      React.createElement(
        'tbody',
        null,
        rows
      )
    );
    return Table;
  },

  render: function () {
    var data = this.state.data;
    var tab = this.makeTable(data);
    return React.createElement(
      'div',
      null,
      React.createElement(
        'h2',
        { className: 'tableTitle' },
        'DataTable'
      ),
      tab
    );
  }

});

var MenuComponent = React.createClass({
  displayName: 'MenuComponent',


  getInitialState: function () {
    return {
      data: []
    };
  },

  selectData: function (selection) {
    location.href = '/?data=' + selection;
    console.log('/?data=' + selection);
    this.fetchData();
  },

  fetchData: function () {
    var dataUrl = '/data';
    $.ajax({
      type: 'GET',
      url: dataUrl,
      dataType: 'json',
      success: function (result) {
        this.setState({ data: result });
        this.props.getSelectedData(result);
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(dataUrl, status, err.toString());
      }
    });
  },

  componentDidMount() {
    this.fetchData();
  },

  render: function () {
    var menuTitles = ['Iris', 'customers'];
    var menuItems = menuTitles.map(function (item, index) {
      return React.createElement(
        'button',
        { value: item, onClick: () => this.selectData(item),
          key: 'menuButton:' + index, className: 'w3-bar-item w3-button w3-padding' },
        React.createElement('i', { key: index, className: 'fa fa-users fa-fw' }),
        item
      );
    }.bind(this));
    return React.createElement(
      'div',
      { className: 'w3-bar-block' },
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

var Table = React.render(React.createElement(TableComponent, null), document.getElementById('tableDisplay'));

var Menu = React.render(React.createElement(MenuComponent, { getSelectedData: Table.getSelectedData }), document.getElementById('menuItems'));
