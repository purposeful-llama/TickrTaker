import React, {Component} from 'react';
import Navbar1 from './navbar1.jsx';
import Navbar2 from './navbar2.jsx';

export default class App extends Component {
  constructor (props) {
    super (props);
    this.state = {
      isAuth: false
    };
    this.isLoggedIn = this.isLoggedIn.bind(this);
  }

  isLoggedIn () {
    console.log('isloggedin called');
    this.setState({
      isAuth: true
    });
    
  }

  render() {
    var navbar = this.state.isAuth ? <Navbar2 /> : <Navbar1 fb={this.isLoggedIn}/>;
    return (
      <div>
        {navbar}
        {this.props.children}
      </div>

    );
  }
}