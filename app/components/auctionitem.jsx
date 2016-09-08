import React, {Component} from 'react';

export default class ActionItem extends Component {
  constructor () {
    super ();
    this.state = {
      item: {}
    };
    this.getItem = this.getItem.bind(this);
  }

  componentDidMount () {
    this.getItem();
  }

  getItem () {
    var context = this;
    $.ajax({
      method: 'GET',
      url: '/api/allitems',
      headers: {'Content-Type': 'application/json'},
      success: function (res) {
        context.setState({item: res});
      }
    });
  }

  render () {
    return (
      <div>
      This is an item view! {this.props.params.id}
      </div>
    );
  }
}