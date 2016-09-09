import React, {Component} from 'react';
import {browserHistory} from 'react-router';

export default class AuctionItem extends Component {
  constructor (props) {
    super (props);
    this.state = {
      item: {},
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
  componentWillMount () {
    this.getItemBids();
    this.getItem();
    this.setState({
      currentPrice: '$  ' + this.calcPrice().toFixed(2),
      timeRemaining: this.calcTime()
    });
  }
  
  componentDidMount () {
    if ( !this.props.auth() ) {
      browserHistory.push('/');
    }
    
    this.interval = setInterval(() => this.setState({
      currentPrice: '$  ' + this.calcPrice().toFixed(2),
      timeRemaining: this.calcTime()
    }), 1000);
  }

  componentWillUnmount () {
    clearInterval(this.interval);
  }

  calcPrice () {

    var cal = ((this.state.item.startPrice - this.state.item.endPrice) /
    ((Date.parse(this.state.item.endDate)) - Date.parse(this.state.item.startDate))) * (Date.parse(this.state.item.endDate) - Date.now());
    return cal;
  }

  getItem () {
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

  getItemBids () {
    var context = this;
    $.ajax({
      method: 'GET',
      url: '/api/items/bids/' + this.props.params.id,
      headers: {'Content-Type': 'application/json'},
      success: function (res) {
        var sorted = res.sort(function (a, b) {
          return a.price < b.price;
        });
        context.setState({bids: sorted[0]});
      }
    });

  }

  calcTime () {
    var duration = Date.parse(this.state.item.endDate) - Date.now();
    var seconds = parseInt((duration / 1000) % 60);
    var minutes = parseInt((duration / (1000 * 60)) % 60);
    var hours = parseInt((duration / (1000 * 60 * 60)) % 24);
    var days = parseInt(((duration) / (1000 * 60 * 60 * 24)) % 365);

    days = (days < 10) ? '0' + days : days;
    hours = (hours < 10) ? '0' + hours : hours;
    minutes = (minutes < 10) ? '0' + minutes : minutes;
    seconds = (seconds < 10) ? '0' + seconds : seconds;
    return days + ' days  ' + hours + ':' + minutes + ':' + seconds + ' hours';
  }

  sendItemBid() {
    if (this.state.bids === undefined || $('#bid').val() > this.state.bids.price + 1 && $('#bid').val() !== '') {
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
    var startDate = new Date(Date.parse(this.state.item.startDate));
    var startDateFormatted = startDate.getMonth() + '/' + startDate.getDate() + '/' + startDate.getFullYear() + '  ' + startDate.getHours() % 12 + ':' + ((startDate.getMinutes() < 10) ? '0' + startDate.getMinutes() : startDate.getMinutes()) + (startDate.getHours() > 12 ? ' PM' : ' AM');
    var endDate = new Date(Date.parse(this.state.item.endDate));
    var endDateFormatted = startDate.getMonth() + '/' + endDate.getDate() + '/' + endDate.getFullYear() + '  ' + endDate.getHours() % 12 + ':' + ((endDate.getMinutes() < 10) ? '0' + endDate.getMinutes() : endDate.getMinutes()) + (endDate.getHours() >= 12 ? ' PM' : ' AM');
    $('.alert .close').on('click', function(e) {
      $(this).parent().hide();
    });
    $('#bid-form').submit(function(e) {
      e.preventDefault();
    });
    return (
      <div className="container-flex">
        <h2>{this.state.item.title}</h2>
        <div>Description: {this.state.item.description}</div>
        <img src={this.state.item.picture}></img>
        <div>Start Date: {startDate.toLocaleDateString() + ' ' + startDate.toLocaleTimeString()}</div>
        <div>End Date: {endDate.toLocaleDateString() + ' ' + endDate.toLocaleTimeString()}</div>
        <div>Time Remaining: {this.state.timeRemaining}</div>
        <div> Current Price: {this.state.currentPrice} </div>
        <div> Highest Bid:{this.state.bids !== undefined ? '$ ' + this.state.bids.price : ' No Bids' }</div>
        <form id="bid-form" onSubmit={this.sendItemBid}>
          <div>Enter Bid <input id="bid" type="number" step = "0.01" placeholder="Enter a bid"></input> </div>
          <button type="button" className="btn btn-primary" onClick={this.sendItemBid}> Submit Bid</button>

        </form>
        <div className="alert alert-danger fade in" role="alert" id="bid-error" style={{display: 'none'}}>
            <button type="button" className="close">×</button>
            <strong>Woah! </strong>Please place a valid bid. <small>Tip: Try value higher than the current highest bid!</small>
        </div>
      </div>
    );
  }
}
