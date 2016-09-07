import React, {Component} from 'react';

export default class Seller extends Component {
  constructor(props) {
    super(props);
    this.state = {
      item: {}
    };
  }
  componentWillMount() {
    $.ajax({
      method: 'GET',
      url: 'api/user_data',
      success: function(user) {
        console.log(user);
        $.ajax({
          method: 'POST',
          url: 'api/selleritems',
          headers: {'Content-Type': 'application/json'},
          data: {user: JSON.stringify(user.user), item: JSON.stringify(item)},
          success: function(item) {
            console.log('successfully posted item');
          }
        });
      }
    });
  }

  render() {
    return (
      <div>
        Seller
      </div>
    );
  }
}