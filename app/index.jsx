import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, Link, hashHistory} from 'react-router';
import App from './components/app.jsx';
import Login from './components/login.jsx';
import Signup from './components/signup.jsx';
import Main from './components/main.jsx';
import Auctions from './components/auctions.jsx';
import NotFound from './components/notfound.jsx';

ReactDOM.render((
  <Router history={hashHistory}>
    <Route path='/' component={App}>
      <Route path='/main' component={Main} />
      <Route path='/auctions' component={Auctions} />
      <Route path='/login' component={Login} />
      <Route path='/signup' component={Signup} />
      <Route path='*' component={NotFound} />
    </Route>
    <Route path='*' component={NotFound} />
  </Router>
), document.getElementById('root'));