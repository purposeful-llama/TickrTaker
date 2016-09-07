import React, {Component} from 'react';
import Navbar1 from './navbar1.jsx';
import Navbar2 from './navbar2.jsx';

export default class App extends Component {
  constructor (props) {
    super (props);
    this.state = {
      isAuth: false
    };
  }

  componentWillMount() {
    var context = this;
    $.get('/checkLogin').then(function(data) {
      context.setState({
        isAuth: data === 'authenticated'
      });
    }).catch(function(err) {
      context.setState({
        isAuth: false
      });
    });
  }

  render() {
    var navbar = this.state.isAuth ? <Navbar2 /> : <Navbar1 />;
    return (
      <div>
        {navbar}
        {this.props.children}
      </div>
    );
  }
}