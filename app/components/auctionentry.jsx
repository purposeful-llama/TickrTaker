import React, {Component} from 'react';
import {Link} from 'react-router';
import {calcPrice, calcTime} from '../helpers.js';

export default class AuctionEntry extends Component {
  constructor (props) {
    super(props);
    this.state = {
      currentPrice: undefined
    };
    this.calcPrice = this.calcPrice.bind(this);
  }

  componentWillMount() {
    this.setState({
      currentPrice: '$  ' + this.calcPrice().toFixed(2),
      timeRemaining: this.calcTime()
    });
  }
  
  componentDidMount () {
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
    var thisItem = this.props.item;
    return calcPrice(thisItem.startPrice, thisItem.endPrice, thisItem.startDate, thisItem.endDate);
    // var cal = ((this.props.item.startPrice - this.props.item.endPrice) /
    // ((Date.parse(this.props.item.endDate)) - Date.parse(this.props.item.startDate))) * (Date.parse(this.props.item.endDate) - Date.now());
    // return cal;
  }

  calcTime () {
    return calcTime(this.props.item.auctionEndDateByHighestBid);
    // var duration = Date.parse(this.props.item.endDate) - Date.now();
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


  render () {
    var button;
    var id = '/item/' + this.props.item.id;
    return (
      <div className={this.props.parity ? 'col-xs-12 auction-entry-odd ' : 'col-xs-12 auction-entry-even '}>
        <div className="col-xs-3">
          <img className="img-fluid" src={this.props.item.picture}></img>
        </div>
        <div className="col-xs-4">
          <div className="row">
            <h3>{this.props.item.title || 'Sample Title'}</h3>
          </div>
          <div className="row item-description">
            {this.props.item.description.length > 90 ? this.props.item.description.slice(0, 90) + '...' : this.props.item.description}
          </div>
        </div>
        <div className="col-xs-3 item-ticker">
          <div className="row current-price"> Current Price: <span>{this.state.currentPrice}</span> </div>
          <div className="row time-remaining"> Time remaining: <span>{this.state.timeRemaining}</span> </div>
        </div>
        <div className = "col-xs-2">

{
  button = this.props.auth() ? (
          <div className="bid-button-container">
            <div className="bid-button">
              <Link className='btn btn-primary' to={id}> Make A Bid </Link>
            </div>
          </div>

    ) : <div className="bid-button-container"></div>

}
        </div>
      </div>
    );
  }
}