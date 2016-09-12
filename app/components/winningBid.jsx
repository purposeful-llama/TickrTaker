import React, {Component} from 'react';
import {Link} from 'react-router';
import {calcPrice, calcTime} from '../helpers.js';

export default class WinningBid extends Component {
  constructor (props) {
    super(props);
    this.state = {
      currentBid: undefined,
      currentPrice: undefined
    };
    this.calcPrice = this.calcPrice.bind(this);
    this.goToLink = this.goToLink.bind(this);
  }

  componentDidMount () {
    this.setState({
      currentPrice: '$  ' + this.calcPrice().toFixed(2),
      timeRemaining: this.calcTime(),
      currentBid: '$ ' + this.props.item.myBid.price.toFixed(2)
    });
    this.interval = setInterval(() => this.setState({
      currentPrice: '$  ' + this.calcPrice().toFixed(2),
      timeRemaining: this.calcTime()
    }), 1000);
    this.calcPrice = this.calcPrice.bind(this);
    this.calcTime = this.calcTime.bind(this);

  }
  componentWillUnmount () {
    this.interval && clearInterval(this.interval);
    this.interval = false;
  }


  calcPrice () {
    var thisItem = this.props.item.item; //it's passed in differently..
    if (thisItem) {
      //only run calculations when item is loaded
      return calcPrice(thisItem.startPrice, thisItem.endPrice, thisItem.startDate, thisItem.endDate);
    } else {
      return 0;
    }
    // var cal = ((this.props.item.item.startPrice - this.props.item.item.endPrice) /
    // ((Date.parse(this.props.item.item.endDate)) - Date.parse(this.props.item.item.startDate))) * (Date.parse(this.props.item.item.endDate) - Date.now());
    // return cal;
  }

  calcTime () {
    if (this.props.item.item) {
      return calcTime(this.props.item.item.auctionEndDateByHighestBid);
    } else {
      return '...';
    }
    // var duration = Date.parse(this.props.item.item.endDate) - Date.now();
    // var seconds = parseInt((duration / 1000) % 60);
    // var minutes = parseInt((duration / (1000 * 60)) % 60);
    // var hours = parseInt((duration / (1000 * 60 * 60)) % 24);
    // var days = parseInt(((duration) / (1000 * 60 * 60 * 24)) % 365);

    // days = (days < 10) ? '0' + days : days;
    // hours = (hours < 10) ? '0' + hours : hours;
    // minutes = (minutes < 10) ? '0' + minutes : minutes;
    // seconds = (seconds < 10) ? '0' + seconds : seconds;
    // return days + ' days  ' + hours + ':' + minutes + ':' + seconds + ' hours';
  }
  goToLink() {
    window.location = '/item/' + this.props.item.item.id;
  }
  
  render () {
    var button;
    var id = '/item/' + this.props.item.item.id;
    return (

      <div className={this.props.parity ? 'bid-entry auction-entry-odd col-xs-12' : 'bid-entry auction-entry-even col-xs-12'}>
        <div className="col-xs-3">
          <img className="img-fluid" src={this.props.item.item.picture}></img>
        </div>
        <div className="col-xs-4">
          <div className="row">
            <h3>{this.props.item.item.title || 'Sample Title'}</h3>
          </div>
          <div className="row item-description">
            {this.props.item.item.description.length > 90 ? this.props.item.item.description.slice(0, 90) + '...' : this.props.item.item.description}
          </div>
        </div>
        <div className="col-xs-3 item-ticker">
          <div className="row current-price"> Current Price: <span>{this.state.currentPrice}</span> </div>
          <div className="row current-bid">Current Bid: <span>{this.state.currentBid}</span> </div>
          <div className="row time-remaining"> Time remaining: <span>{this.state.timeRemaining}</span> </div> 
        </div>
        <div className = "col-xs-2">

          <div className="bid-button-container">
            <div className="bid-button">
              <Link className='btn btn-success' to={id}> Review Item </Link></div>
            </div>
        </div>
      </div>
    );
  }
}