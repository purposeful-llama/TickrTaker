import React, { Component } from 'react';
import {Link} from 'react-router'; 

export default class UserSetting extends Component {

  constructor(props) {
    super(props);

    this.state={
      passWord:false,
      address:false,
      phone:false,
      email:false,
      user: {}
    }
  }

  handleSubmit() { 
    this.setState({ user: {
      password: $('#user-password').val(),
      email: $('#user-email').val(),
      address: $('#user-address').val(),
      phone_number: $('#user-phone').val()
    }});

    $.ajax({
      method:'PUT',
      url: '/user',
      // data: // TODO Later
      headers: {'Content-Type': 'application/json'},
      success: function(data) {
        console.log('DATA', data);
      }.bind(this),
      error: function(err) {
        console.log('ERROR', err);
      }.bind(this)
    });
  }

  handlePassword() {
    this.setState({
      passWord:!this.state.passWord
    });
  }

  handleEmail() {
    this.setState({
      email:!this.state.email
    });
  }

  handlePhone() {
    this.setState({
      phone:!this.state.phone
    });
  }

  handleAddress() {
    this.setState({
      address:!this.state.address
    });
  }
  

  render() {
    var passCheck = this.state.passWord ? <div><input id='user-password' type='text' placeholder='Type new password' className="input-xlarge"></input>
                                          <button style={{marginLeft:15}} type='button' className="btn btn-primary" onClick={this.handleSubmit.bind(this)}>Submit</button></div> : '';
    var mailCheck = this.state.email ? <div><input id='user-email' type='text' placeholder='Type new email' className="input-xlarge"></input>
                                       <button style={{marginLeft:15}} type='button' className="btn btn-primary" onClick={this.handleSubmit.bind(this)}>Submit</button></div> : '';
    var addressCheck = this.state.address ? <div><input id='user-address' type='text' placeholder='Type new address' className="input-xlarge"></input> 
                                            <button style={{marginLeft:15}} type='button' className="btn btn-primary" onClick={this.handleSubmit.bind(this)}>Submit</button></div> : '';
    var phoneCheck = this.state.phone ? <div><input id='user-phone' type='text' placeholder='Type new phone number' className="input-xlarge"></input>
                                        <button style={{marginLeft:15}} type='button' className="btn btn-primary" onClick={this.handleSubmit.bind(this)}>Submit</button></div> : '';
    return (
      
      <div style = {{margin: 50}}>
        <div>
          <Link to='/usersetting' onClick={this.handlePassword.bind(this)}><h3>Change Password</h3></Link>
          {passCheck}
        </div>
        <div>
          <Link to='/usersetting' onClick={this.handleEmail.bind(this)}><h3>How it works?</h3></Link>
          {mailCheck}
        </div>
        <div>
          <Link to='/usersetting' onClick={this.handleAddress.bind(this)}><h3>Getting started</h3></Link>
          {addressCheck}
        </div>
        <div>
          <Link to='/usersetting' onClick={this.handlePhone.bind(this)}><h3>Getting started</h3></Link>
          {phoneCheck}
        </div>
      </div>

    );
  }
}