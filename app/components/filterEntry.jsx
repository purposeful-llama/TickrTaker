import React, {Component} from 'react';

export default class FilterEntry extends Component {
  render () {
    return (
      <div onClick={this.props.handleClick}>
        <h5>{this.props.item}</h5>
      </div>
    );
  }
}