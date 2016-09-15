import React, {Component} from 'react';

export default class Message extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
        <div className="col-md-12 msg-container">
          <h6>{this.props.subject}</h6>
          <div>
            {this.props.message}
          </div>
        </div>
      );
  }
}