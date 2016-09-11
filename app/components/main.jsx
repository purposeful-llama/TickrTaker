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

  // showTickrIntro() {
  //   this.setState({
  //     tickr: !this.state.tickr
  //   });
  // }

  // showHowItWorks() {
  //   this.setState({
  //     howWorks: !this.state.howWorks
  //   });
  // }

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
    var introHow = 'So easy, create you account, choose the item and booom! ';

    return (
      <div className="landing-page col-xs-12">
        <div className="landing-video col-xs-12">
        <div className="video-container">
          <video id="bgvid" autoPlay muted loop>
            <source src="compiled/smallwatch_sepia.mp4" type="video/mp4"/>
          </video>
        </div>
          <div className="landing-video-text">
          <div className="landing-video-title">Tickr</div>
          <div className="landing-video-description">time-sensitive auctions</div>
          </div>
        </div>
        <div className="what-is-tickr-container col-xs-12">
          <div className="intro-tickr-header col-xs-12">
            What Is Tickr?
            <hr/>
          </div>
          <div className="space col-xs-12">
          </div>
          <div className="intro-tickr-text col-xs-7">
            Not everything has a fixed price tag. If you are selling a short-lived item, like a ticket or voucher, each passing second reduces its value to you.
            <br/>
            <br/>
            If time is money, we believe that prices should reflect that.
          </div>
          <div className="intro-tickr-examples col-xs-12">
            <img className="img-fluid img-circle" src="compiled/tickets.png" />
          </div>
        </div>
        <div>
          <Link to='/'><h3>How it works?</h3></Link>
          <p>{introHow}</p>
        </div>
        <div>
          <Link to='/auctions'><h3>Get started.</h3></Link>
        </div>
        <div>
          {
            this.state.items.map((element, i) => {
              return (<Mainitems key={i} item={element} />);
            })
          }
        </div>
      </div>
    );
  }
}
