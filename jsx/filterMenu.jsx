/* eslint-disable no-unused-vars */
/* global React data */

var TableComponent = React.createClass({

  getInitialState: function () {
    return {
      data: data.observations
    }
  },

  getSelectedData: function (data) {
    this.setState({data: data})
  },

  makeTable: function (data) {
    var colnames = data.length > 0 ? Object.keys(data[1]) : []
    var headers = colnames.map((val, index) => <th>{val}</th>)
    var rows = data.map((row, index) => {
      var vals = Object.keys(row)
      var details = vals.map((str, indx) =>
        <td key={'Table' + index + row[str]}>{row[str]}</td>)
      return (<tr key = {'Row' + index}>{details}</tr>)
    })
    const Table = (data) = (
      <table key ={'Main Table'} id = "MainTable"
        className = "w3-table w3-striped w3-bordered w3-border w3-hoverable w3-white">
        {headers}
        <tbody>
          {rows}
        </tbody>
      </table>
    )
    return Table
  },

  render: function () {
    var data = this.state.data
    var tab = this.makeTable(data)
    return (<div>
      <h2 className = "tableTitle">DataTable</h2>
      {tab}
    </div>)
  }

})

var MenuComponent = React.createClass({

  getInitialState: function () {
    return {
      data: []
    }
  },

  selectData: function (selection) {
    location.href = '/?data=' + selection
    console.log('/?data=' + selection)
    this.fetchData()
  },

  fetchData: function () {
    var dataUrl = '/data'
    $.ajax({
      type: 'GET',
      url: dataUrl,
      dataType: 'json',
      success: function (result) {
        this.setState({ data: result })
        this.props.getSelectedData(result)
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(dataUrl, status, err.toString())
      }
    })
  },

  componentDidMount () {
    this.fetchData()
  },

  render: function () {
    var menuTitles = ['Iris', 'customers']
    var menuItems = menuTitles.map(function (item, index) {
      return (
        <button value = {item} onClick = {() => this.selectData(item)}
          key = {'menuButton:' + index} className="w3-bar-item w3-button w3-padding">
          <i key = {index} className="fa fa-users fa-fw"></i>
          {item}
        </button>)
    }.bind(this))
    return (
      <div className="w3-bar-block">
        <button href="#" className="w3-bar-item w3-button w3-padding w3-blue">
          <i className="fa fa-users fa-fw"></i>
          Menu
        </button>
        {menuItems}
      </div>
    )
  }
})

var Table = React.render(
  <TableComponent>
  </TableComponent>,
  document.getElementById('tableDisplay'))

var Menu = React.render(
  <MenuComponent getSelectedData = {Table.getSelectedData}>
  </MenuComponent>,
  document.getElementById('menuItems'))
