import React, {Component} from 'react';
import {Link} from 'react-router';

export default class Main extends Component {
  constructor(props) {
    super(props);
  }

  render () {      // Render main page
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
          <div className="intro-tickr-text col-md-5 col-xs-8">
            Not everything has a fixed price tag. If you are selling a short-lived item, like a ticket or voucher, each passing second reduces its value to you.
            <br/>
            <br/>
            If time is money, we believe that prices should reflect that.
          </div>
          <div className="space col-xs-12">
          </div>
        </div>
      </div>
    );
  }
}
