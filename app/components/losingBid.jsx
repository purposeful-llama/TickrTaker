import React, {Component} from 'react';
import {Link} from 'react-router';
import {calcPrice, calcTime} from '../helpers.js';

export default class LosingBid extends Component {
  constructor (props) {
    super(props);
    this.state = {
      currentBid: undefined,
      currentPrice: undefined
    };
    this.calcPrice = this.calcPrice.bind(this);
    console.log(this.props.item);
  }

  componentDidMount () {    //  set and update state properties every 1000 seconds
    $('img').on('error', function(){ //  Replace broken image links with the sample image
        $(this).attr('src', 'http://res.cloudinary.com/dijpyi6ze/image/upload/v1473715896/item_photos/zfaehmp20xculww4krs6.jpg');
    });
    
    this.setState({
      currentPrice: '$ ' + this.calcPrice().toFixed(2),
      currentHighestBid: '$ ' + this.props.item.highestBid.toFixed(2),
      timeRemaining: this.calcTime(),
      currentBid: '$ ' + this.props.item.myBid.price.toFixed(2)
    });
    this.interval = setInterval(() => this.setState({
      currentPrice: '$ ' + this.calcPrice().toFixed(2),
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
    var thisItem = this.props.item.item; //  it's passed in differently..
    if (thisItem) {
      //  only run calculations when item is loaded
      return calcPrice(thisItem.startPrice, thisItem.endPrice, thisItem.startDate, thisItem.endDate);
    } else {
      return 0;
    }
  }

  calcTime () {
    if (this.props.item.item) {
      return calcTime(this.props.item.item.auctionEndDateByHighestBid);
    } else {
      return '...';
    }
  }

  render () {
    var id = '/item/' + this.props.item.item.id;
    return (
      <div className={this.props.parity ? 'col-xs-12 auction-entry-odd ' : 'col-xs-12 auction-entry-even'}>
        <div className="col-md-3 col-sm-12">
          <img className="img-fluid" src={this.props.item.item.picture}></img>
        </div>
        <div className="col-md-4 col-sm-12">
          <div>
            <h3>{this.props.item.item.title || 'Sample Title'}</h3>
          </div>
          <div className="item-description">
            {this.props.item.item.description.length > 90 ? this.props.item.item.description.slice(0, 90) + '...' : this.props.item.item.description}
          </div>
        </div>
        <div className="col-md-3 col-sm-12 item-ticker">
          {
            this.props.old ? ( ''
            ) : <div className="row current-price"> Current Price: <span>{this.state.currentPrice}</span> </div>
          } 
          <div className="row current-highest-bid">Highest Bid: <span>{this.state.currentHighestBid}</span> </div>
          {
            this.props.old ? (
            <div className="row current-bid"> My Bid: <span>{this.state.currentBid}</span> </div>
            ) : <div className="row current-bid">Current Bid: <span>{this.state.currentBid}</span> </div>
          } 
          {
            this.props.old ? (
              <div className="row time-remaining"> Completed On: <span>{this.props.item.item.endDate}</span> </div> 
            ) : <div className="row time-remaining"> Time remaining: <span>{this.state.timeRemaining}</span> </div>
          }        
        </div>
        <div className = "col-md-2 col-sm-12">

          <div className="bid-button-container">
            <div className="bid-button">
          {
            this.props.old ? (
              <Link className='btn btn-danger' to={id}> Details </Link>
            ) : 
              <Link className='btn btn-danger' to={id}> Make Another Bid </Link>
          }   
            </div>
          </div>
        </div>
      </div>
    );
  }
}
