import React, {Component} from 'react';       //  Import react and react-router components
import ReactDOM from 'react-dom';
import {Router, Route, Link, hashHistory, IndexRoute, browserHistory} from 'react-router';
import App from './components/app.jsx';
import Main from './components/main.jsx';
import Auctions from './components/auctions.jsx';
import NotFound from './components/notfound.jsx';
import Dashboard from './components/dashboard.jsx';
import AddAuctionItem from './components/addauctionitem.jsx';
import AuctionItem from './components/auctionitem.jsx';
import UserSetting from './components/usersetting.jsx';
import History from './components/history.jsx';


ReactDOM.render((                             //  Set up routes to navigate between different pages
  <Router history={browserHistory}>     
    <Route path='/' component={App} >
      <IndexRoute component={Main} />
      <Route path='/auctions' component={Auctions} />
      <Route path='/item/:id' component={AuctionItem}/>
      <Route path='/dashboard' component= {Dashboard} />
      <Route path='/makeauction' component = {AddAuctionItem}/>
      <Route path='/usersetting' component={UserSetting} />
      <Route path='/history' component={History} />
      <Route path='*' component={NotFound} />
    </Route>
  </Router>
), document.getElementById('root'));