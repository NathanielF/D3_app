
var MenuComponent = React.createClass({

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
          this.setState({ data: result })
        }.bind(this),
        error: function (xhr, status, err) {
          console.error("/data", status, err.toString());
        }.bind(this)
      });
    },
  
    componentDidMount() {
      this.fetchData()
    },

    render: function () {
      var menuTitles = ["Iris", "MPG"];
      var menuItems = menuTitles.map(function(item, index){
        return <a key = {index} href="#" className="w3-bar-item w3-button w3-padding">
                <i key = {index} className="fa fa-users fa-fw"></i>  
                {item}
               </a>
      })
        return (
        <div class="w3-bar-block">
        <a href="#" className="w3-bar-item w3-button w3-padding w3-blue"><i className="fa fa-users fa-fw"></i>  Overview</a>
            {menuItems}
        </div>
        )
      }
  });

var MenuComponent = ReactDOM.render(
    <MenuComponent></MenuComponent>, document.getElementById('menuItems'));