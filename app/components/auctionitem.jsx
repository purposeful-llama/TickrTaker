import React, {Component} from 'react';

export default class AuctionItem extends Component {
  constructor (props) {
    super (props);
    this.state = {
      item: {},
      currentPrice: undefined,
      bids: []
    };
    this.getItem = this.getItem.bind(this);
    this.getItemBids = this.getItemBids.bind(this);
    this.calcPrice = this.calcPrice.bind(this);
    this.sendItemBid = this.sendItemBid.bind(this);
  }

  componentDidMount () {
    this.getItemBids();
    this.getItem();
    this.setState({
      currentPrice: '$  ' + this.calcPrice().toFixed(2),
    });
    this.interval = setInterval(() => this.setState({
      currentPrice: '$  ' + this.calcPrice().toFixed(2),
      
    }), 1000);
  }

  componentWillUnmount () {
    clearInterval(this.interval);
  }

  calcPrice () {

    var cal = ((this.state.item.startPrice - this.state.item.endPrice) /
    ((Date.parse(this.state.item.endDate) + 2.592e+9) - Date.parse(this.state.item.startDate))) * (Date.parse(this.state.item.endDate) + 2.592e+9 - Date.now());
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
        console.log(sorted[0].price);
        context.setState({bids: sorted[0]});
        console.log(context.state);
      }
    });

  }
  sendItemBid() {
    var context = this;
    $.ajax({
      method: 'GET',
      url: '/api/user_data',
      success: function(user) {
        console.log(user);
        $.ajax({
          method: 'POST',
          url: '/api/items/bids/' + context.props.params.id,
          headers: {'Content-Type': 'application/json'},
          data: JSON.stringify({user: user, 
            bid: $('#bid').val()}),
          success: function (res) {
            console.log(res);
            context.render();
            $('#bid').val('');
          }
        });
      }
    });
  }

  render () {
    return (
      <div className="container-flex">
        <h2>{this.state.item.title}</h2>
        <div>Description: {this.state.item.description}</div>
        <img src={this.state.item.picture}></img>
        <div>Start Date: {this.state.item.startDate}</div>
        <div>End Date: {this.state.item.endDate}</div>
        <div> Current Price: {this.state.currentPrice} </div>
        <div> Highest Bid: $ {this.state.bids.price}</div>
        <form>
          <div>Enter Bid <input id="bid" placeholder="Enter a bid"></input> </div>
          <button type="button" className="btn btn-primary" onClick={this.sendItemBid}> Submit Bid</button>
        </form>
      </div>
    );
  }
}