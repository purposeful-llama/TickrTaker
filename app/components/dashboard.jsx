import React, {Component} from 'react';

export default class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: []
    }
  }
  componentWillMount() {
    var context = this;
    $.ajax({
      method: 'GET',
      url: 'api/user_data',
      success: function(user) {
        console.log(user);
        $.ajax({
          method: 'POST',
          url: 'api/selleritems',
          headers: {'Content-Type': 'application/json'},
          data: JSON.stringify(user),
          success: function(items) {
            context.setState({'items': items});
            console.log(context.state);
          }
        });
      }
    });
  }

  render() {
    return (
      <div>
        <div>
          Welcome to the dashboard!!!

        </div>
        <div> {this.state.items.map((item) => {
          console.log(item);
          return (<div> {item.title} </div>);
        }) }
        </div>
      </div>
    );
  }
}