import React, {Component} from 'react';
import {Link} from 'react-router';

export default class Navbar1 extends Component {
  constructor (props) {
    super(props);
  }

  render() {
    return (
      <nav id="navbar1" className="navbar navbar-dark bg-inverse navbar-fixed-top">
        <ul className="nav navbar-nav">
          <li className="nav-item ">
            <Link className="nav-link" to="/auctions">Auctions </Link>
          </li>
          <li className="navbar-brand">
            <Link className="nav-link" id="brand-name" to="/"> Tickr </Link>
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
            <a className="nav-link" href="/auth/facebook">Facebook</a>
          </li>
        </ul>
      </nav>
    );
  }
}