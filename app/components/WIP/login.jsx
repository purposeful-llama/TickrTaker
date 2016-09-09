import React, {Component} from 'react';

export default class Login extends Component {
  render() {
    return (
      <div>
        <div>
          <span>User name: <input placeholder='Username'></input></span>
        </div>
        <div>
          <span>Password: <input placeholder='Password'></input></span>
        </div>
        <div>
          <button type='button' className='btn btn-primary'>Log In</button>
        </div>

      </div>
    );
  }
}