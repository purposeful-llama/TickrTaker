import React, {Component} from 'react';

export default class FilterEntry extends Component {
  constructor (props) {
    super(props)
  }

  render () {
    return (
      <div className="filter-entry" onClick={this.props.handleClick}>
        <p>{this.props.filter}</p>
      </div>
    );
  }
}