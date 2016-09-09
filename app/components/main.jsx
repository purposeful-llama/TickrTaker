import React, {Component} from 'react';
import Auction from './auctions.jsx';
import {Link} from 'react-router';
import Mainitems from './mainitems.jsx';

export default class Main extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tickr: false,
      howWorks: false,
      items: []
    };
  }

  showTickrIntro() {
    this.setState({
      tickr: !this.state.tickr
    });
  }

  showHowItWorks() {
    this.setState({
      howWorks: !this.state.howWorks
    });
  }

  componentWillMount () {
    $.ajax({
      method: 'GET',
      url: '/api/allitems',
      headers: {'Content-Type': 'application/json'},
      success: function (res) {
        this.setState({
          items: res
        });
      }.bind(this),
      error: function(err) {
        console.log('Error', err);
      }.bind(this)
    });
  }

  render () {
    var tickrText = 'Tickr is a reverse bidding website that purchase prices for items goes down instead of up.' +
                    ' Reverse selling method provides fast profit for seller and reasonable prices for buyer';
    var howWorksText = 'So easy, create you account, choose the item and booom! ';
    var introTickr = this.state.tickr ? tickrText : '';
    var introHow = this.state.howWorks ? howWorksText : '';

    return (
      <div>
        <div>
          <Link to='/' onClick={this.showTickrIntro.bind(this)}><h3>What is Tickr?</h3></Link>
          <p>{introTickr}</p>
        </div>
        <div>
          <Link to='/' onClick={this.showHowItWorks.bind(this)}><h3>How it works?</h3></Link>
          <p>{introHow}</p>
        </div>
        <div>
          <Link to='/auctions' onClick={this.showTickrIntro.bind(this)}><h3>Getting started</h3></Link>
        </div>
        <div>
          {
            this.state.items.map((element, index) => {
              return (<Mainitems key={index} item={element} />);
            })
          }
        </div>
      </div>
    );
  }
}