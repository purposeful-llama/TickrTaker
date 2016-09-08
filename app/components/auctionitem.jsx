import React, {Component} from 'react';

export default class AuctionItem extends Component {
  constructor (props) {
    super (props);
    this.state = {
      item: {},
      currentPrice: undefined,
      bids: undefined
    };
    this.getItem = this.getItem.bind(this);
    this.getItemBids = this.getItemBids.bind(this);
    this.calcPrice = this.calcPrice.bind(this);
  }

  componentDidMount () {
    this.getItem();
    this.getItemBids();
    this.setState({
      currentPrice: '$  ' + this.calcPrice().toFixed(2),
    });
    this.interval = setInterval(() => this.setState({
      currentPrice: '$  ' + this.calcPrice().toFixed(2),
      
    }), 1000);
    this.calcPrice = this.calcPrice.bind(this);
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
        context.setState({bids: res});
      }
    });
  }

  render () {
    console.log(this.state.bids);
    return (
      <div className="container-flex">
        <h2>{this.state.item.title}</h2>
        <div>Description: {this.state.item.description}</div>
        <img src={this.state.item.picture}></img>
        <div>Start Date: {this.state.item.startDate}</div>
        <div>End Date: {this.state.item.endDate}</div>
        <div> Current Price: {this.state.currentPrice} </div>
        <form>
          <div>Enter Bid </div>
        </form>
      </div>
    );
  }
}