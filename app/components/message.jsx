import React, {Component} from 'react';

export default class Message extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
        <div className="msg-container">
          <div>
            {/*this.props.title*/}
          </div>
          <div>
            {this.props.message}
          </div>
        </div>
      );
  }
}