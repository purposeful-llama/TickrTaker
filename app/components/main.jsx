import React, {Component} from 'react';
import Auction from './auctions.jsx';
import {Link} from 'react-router';

export default class Main extends Component {
  constructor(props) {
    super(props);

    this.state = {
  	  tickr: false,
  	  howWorks:false
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
      </div>
    );
  }
}