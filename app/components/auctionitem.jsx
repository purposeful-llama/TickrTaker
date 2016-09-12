import React, {Component} from 'react';
import {browserHistory} from 'react-router';
import {calcPrice, calcTime} from '../helpers.js';

export default class AuctionItem extends Component {
  constructor (props) {
    super (props);
    this.state = {
      item: undefined,
      currentPrice: undefined,
      bids: [],
      timeRemaining: undefined
    };
    this.getItem = this.getItem.bind(this);
    this.getItemBids = this.getItemBids.bind(this);
    this.calcPrice = this.calcPrice.bind(this);
    this.calcTime = this.calcTime.bind(this);
    this.sendItemBid = this.sendItemBid.bind(this);
  }
  componentWillMount () {      // Set state properties with updated values that were calculated with calcTime and calcPrice


    this.getItemBids();
    this.getItem();
    this.setState({
      currentPrice: this.calcPrice().toFixed(2),
      timeRemaining: this.calcTime()
    });
  }
  
  componentDidMount () {       //  Set state properties with calculated values
    
    $('img').on('error', function(){ //  Replace broken image links with the sample image
        $(this).attr('src', 'http://res.cloudinary.com/dijpyi6ze/image/upload/v1473715896/item_photos/zfaehmp20xculww4krs6.jpg');
    });
    
    this.interval = setInterval(() => this.setState({
      currentPrice: '$  ' + this.calcPrice().toFixed(2),
      timeRemaining: this.calcTime()
    }), 1000);
  }

  componentWillUnmount () {    // Clears up DOM elements that were created in ComponentDidMount method
    clearInterval(this.interval);
  }

  calcPrice () {
    var thisItem = this.state.item;
    if (thisItem) {
      //only run calculations when item is loaded
      return calcPrice(thisItem.startPrice, thisItem.endPrice, thisItem.startDate, thisItem.endDate);
    } else {
      return 0;
    }
  }

  calcTime () {
    if (this.state.item) {
      return calcTime(this.state.item.auctionEndDateByHighestBid);
    } else {
      return '...';
    }
  }

  getItem () {          // Ajax request to retrieve items from database
    var context = this;
    $.ajax({
      method: 'GET',
      url: '/api/singleitem/' + this.props.params.id,
      headers: {'Content-Type': 'application/json'},
      success: function (res) {
        context.setState({item: res});
      }
    });
  }

  getItemBids () {     // Ajax request to retrieve bid values from database
    var context = this;
    $.ajax({
      method: 'GET',
      url: '/api/items/bids/' + this.props.params.id,
      headers: {'Content-Type': 'application/json'},
      success: function (res) {
        var sorted = res.sort(function (a, b) {
          return a.price < b.price;
        });
        context.setState({bids: sorted});
      }
    });
  }

  sendItemBid(e) {     // Ajax request to bid on an item
    e.preventDefault();
    if (this.state.bids[0] === undefined || $('#bid').val() >= this.state.bids[0].price + 1 && $('#bid').val() !== '') {
      var context = this;
      $.ajax({
        method: 'GET',
        url: '/api/user_data',
        success: function(user) {
          $.ajax({
            method: 'POST',
            url: '/api/items/bids/' + context.props.params.id,
            headers: {'Content-Type': 'application/json'},
            data: JSON.stringify({user: user, 
              bid: $('#bid').val()}),
            success: function (res) {
              $('#bid').val('');
              console.log(res);
              context.getItem();
              context.getItemBids();
            }
          });
        }
      });
    } else {
      $('#bid-error').show();
    }
  }

  render () {
    
    var thisItem = this.state.item || {};
    var startDate = new Date(Date.parse(thisItem.startDate));
    var startDateFormatted = startDate.getMonth() + '/' + startDate.getDate() + '/' + startDate.getFullYear() + '  ' + startDate.getHours() % 12 + ':' + ((startDate.getMinutes() < 10) ? '0' + startDate.getMinutes() : startDate.getMinutes()) + (startDate.getHours() > 12 ? ' PM' : ' AM');
    var endDate = new Date(Date.parse(thisItem.auctionEndDateByHighestBid));
    var endDateFormatted = endDate.getMonth() + '/' + endDate.getDate() + '/' + endDate.getFullYear() + '  ' + endDate.getHours() % 12 + ':' + ((endDate.getMinutes() < 10) ? '0' + endDate.getMinutes() : endDate.getMinutes()) + (endDate.getHours() >= 12 ? ' PM' : ' AM');
    $('.alert .close').on('click', function(e) {
      $(this).parent().hide();
    });

    return (
      <div className="col-xs-12 auction-item-container">
        <div className="col-md-6 col-xs-12">
          <img className="img-fluid" src={thisItem.picture}></img>
        </div>
        <div className="auction-item-details col-md-6 col-xs-12">
          <br />
          <h2>{thisItem.title}</h2>
          <hr className="auction-item-title-hr"/>
          <div className="col-xs-12">Description: {thisItem.description}</div>
          <div className="col-xs-12">Start Date: {startDate.toLocaleDateString() + ' ' + startDate.toLocaleTimeString()}</div>
          <div className="col-xs-12">End Date: {endDate.toLocaleDateString() + ' ' + endDate.toLocaleTimeString()}</div>
          <div className="col-xs-12">Time Remaining: {this.state.timeRemaining}</div>
          <div className="col-xs-12"> Current Price: {this.state.currentPrice} </div>
            <div className="col-xs-12"> Highest Bid: {this.state.bids[0] !== undefined ? '$ ' + this.state.bids[0].price.toFixed(2) : ' No Bids' }</div>
          <form id="bid-form" onSubmit={this.sendItemBid}>
            <div className="col-xs-12">Enter Bid <input id="bid" type="number" step = "0.01" placeholder="Enter a bid"></input> </div>
            <button type="button" className="btn btn-primary pull-xs-right" onClick={this.sendItemBid}> Submit Bid</button>

          </form>
          <div className="alert alert-danger fade in" role="alert" id="bid-error">
              <button type="button" className="close">×</button>
              <strong>Woah! </strong>Please place a valid bid. <small>Tip: Try value higher than the current highest bid!</small>
          </div>
        </div>
      </div>
    );
  }
}
