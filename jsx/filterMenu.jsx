
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
        return (
        <div class="w3-bar-block">
            <a href="#" className="w3-bar-item w3-button w3-padding w3-blue"><i className="fa fa-users fa-fw"></i>  Overview</a>
            <a href="#" className="w3-bar-item w3-button w3-padding"><i className="fa fa-eye fa-fw"></i>  Views</a>
            <a href="#" className="w3-bar-item w3-button w3-padding"><i className="fa fa-users fa-fw"></i>  Traffic</a>
            <a href="#" className="w3-bar-item w3-button w3-padding"><i className="fa fa-bullseye fa-fw"></i>  Geo</a>
            <a href="#" className="w3-bar-item w3-button w3-padding"><i className="fa fa-diamond fa-fw"></i>  Orders</a>
            <a href="#" className="w3-bar-item w3-button w3-padding"><i className="fa fa-bell fa-fw"></i>  News</a>
            <a href="#" className="w3-bar-item w3-button w3-padding"><i className="fa fa-bank fa-fw"></i>  General</a>
            <a href="#" className="w3-bar-item w3-button w3-padding"><i className="fa fa-history fa-fw"></i>  History</a>
            <a href="#" className="w3-bar-item w3-button w3-padding"><i className="fa fa-cog fa-fw"></i>  Settings</a>
        </div>
        )
      }
  });

var MenuComponent = ReactDOM.render(
    <MenuComponent></MenuComponent>, document.getElementById('menuItems'));