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
    var tickrText = 'Tickr is a reverse bidding website that purchase prices for items goes down instead of up.' +
                    ' Reverse selling method provides fast profit for seller and reasonable prices for buyer';
    var howWorksText = 'So easy, create you account, choose the item and booom! ';
    var introTickr = this.state.tickr ? tickrText : '';
    var introHow = this.state.howWorks ? howWorksText : '';

    return (
      <div className="landing-page col-xs-12">
        <div className="landing-video col-xs-12">
        <video id="bgvid" autoPlay muted loop>
          <source src="compiled/smallwatch_sepia.mp4" type="video/mp4"/>
        </video>
          <div className="landing-video-text">
          <div className="landing-video-title">Tickr</div>
          <div className="landing-video-description">time-sensitive auctions</div>
          </div>
        </div>
        <div className="what-is-tickr-container col-xs-12">
          <div className="col-xs-8">
            {introTickr}
          </div>
          <div className="what-is-tickr col-xs-4"> 
            <Link to='/'>
              What is Tickr?
            </Link>
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
