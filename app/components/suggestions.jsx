import React, {Component} from 'react';

export default class Suggestion extends Component {
  constructor (props) {
    super(props);
    this.state = {
      title: props.title.title
    };
  }

  render () {
    return (
      <div className="suggestion-item">
        <p>{this.state.title}</p>
      </div>
    );
  }
}