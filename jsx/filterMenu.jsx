var MenuComponent = React.createClass({

  getInitialState: function () {
    return {
      data: []
    }
  },

  fetchData: function (dataset) {
    var dataUrl = '/' + dataset
    $.ajax({
      type: 'GET',
      url: dataUrl,
      dataType: 'json',
      success: function (result) {
        this.setState({ data: result })
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(dataUrl, status, err.toString())
      }
    })
  },

  componentDidMount () {
    this.fetchData('Iris')
  },

  render: function () {
    var menuTitles = ['Iris', 'MPG']
    var menuItems = menuTitles.map(function (item, index) {
      return <button value = {item} onClick = {() => this.fetchData(item)} key = {'menuButton:' + index} className="w3-bar-item w3-button w3-padding">
        <i key = {index} className="fa fa-users fa-fw"></i>
        {item}
      </button>
    }.bind(this))
    return (
      <div class="w3-bar-block">
        <button href="#" className="w3-bar-item w3-button w3-padding w3-blue">
          <i className="fa fa-users fa-fw"></i>
          Menu
        </button>
        {menuItems}
      </div>
    )
  }
})

var Menu = React.render(<MenuComponent></MenuComponent>, document.getElementById('menuItems'));