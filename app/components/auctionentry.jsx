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

  componentWillMount() {    // Set state properties with updated values 
    this.setState({
      currentPrice: '$  ' + this.calcPrice().toFixed(2),
      timeRemaining: this.calcTime()
    });
  }
  
  componentDidMount () {    //  Set state properties with calculated values
    this.interval = setInterval(() => this.setState({
      currentPrice: '$  ' + this.calcPrice().toFixed(2),
      timeRemaining: this.calcTime()
    }), 1000);
    this.calcPrice = this.calcPrice.bind(this);
    this.calcTime = this.calcTime.bind(this);

  }
  componentWillUnmount () {    // Clears up DOM elements that were created in ComponentDidMount method
    this.interval && clearInterval(this.interval);
    this.interval = false;
  }

  calcPrice () {     // Price calculation check helper.js 
    var thisItem = this.props.item;
    return calcPrice(thisItem.startPrice, thisItem.endPrice, thisItem.startDate, thisItem.endDate);
  }

  calcTime () {      //  Time calculation check helper.js
    return calcTime(this.props.item.auctionEndDateByHighestBid);
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
          <div className="row current-price auction-price"> Current Price: <br/><span>{this.state.currentPrice}</span> </div>
          <div className="row time-remaining auction-time"> Time remaining: <br/><span>{this.state.timeRemaining}</span> </div>
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
        {
          button = this.props.auth() ? (                       // Show Bid button if user is authorized
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