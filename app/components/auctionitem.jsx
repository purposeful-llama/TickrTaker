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
    console.log(this.state.item);
    return (
      <div className="container-flex">
        <h2>{this.state.item.title}</h2>
        <div>Description: {this.state.item.description}</div>
        <img src={this.state.item.picture}></img>
      </div>
    );
  }
}