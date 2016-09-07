import React, {Component} from 'react';
import {Link} from 'react-router';

export default class Navbar1 extends Component {
  constructor (props) {
    super(props);
  }

  render() {
    return (
      <nav className="navbar navbar-light bg-faded">
        <ul className="nav navbar-nav">
          <li className="nav-item ">
            <Link className="nav-link" to="/auctions">Auctions </Link>
          </li>
          {
          // <li className="nav-item">
          //   <Link className="nav-link " to="/main">Main <span className="sr-only">(current)</span></Link>
          // </li>
          //   <li className="nav-item">
          //   <Link className="nav-link" to="/login">Login</Link>
          // </li>
          // <li className="nav-item">
          //   <Link className="nav-link" to="/signup">Sign Up</Link>
          // </li>
          }
          <li className="nav-item">
            <a className="nav-link" href="/auth/facebook" onClick={this.props.fb}>Facebook</a>
          </li>
        </ul>
      </nav>
    );
  }
}