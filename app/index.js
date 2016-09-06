import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, Link, hashHistory} from 'react-router';
import App from './components/app.js';
import Login from './components/login.js';
import Signup from './components/signup.js';

ReactDOM.render((
  <Router history={hashHistory}>
    <Route path='/' component={App}>
      <Route path='/login' component={Login} />
      <Route path='/signup' component={Signup} />
    </Route>
  </Router>
), document.getElementById('root'));