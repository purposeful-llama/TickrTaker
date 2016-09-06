import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, Link, hashHistory} from 'react-router';
import App from './components/app.jsx';
import Login from './components/login.jsx';
import Signup from './components/signup.jsx';

ReactDOM.render((
  <Router history={hashHistory}>
    <Route path='/' component={App}>
      <Route path='/login' component={Login} />
      <Route path='/signup' component={Signup} />
    </Route>
  </Router>
), document.getElementById('root'));