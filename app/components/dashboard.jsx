import React, {Component} from 'react';

import WinningBid from './winningBid.jsx';
import LosingBid from './losingBid.jsx';
// import AuctionEntry from './auctionentry.jsx';
import SaleItem from './saleItem.jsx';

export default class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      itemsForSale: [],
      itemsWinningBidOn: [],
      itemsLosingBidOn: []
    };
  }

  componentDidMount() {
    var context = this;
    $.ajax({
      method: 'GET',
      url: 'api/user_data',
      success: function(user) {
        console.log(user);
        $.ajax({
          method: 'POST',
          url: 'api/selleritems',
          headers: {'Content-Type': 'application/json'},
          data: JSON.stringify(user),
          success: function(items) {
            console.log('items are', items);
            context.setState({'itemsForSale': items});
          },
          error: function(err) {
            console.log(err);
          }
        });

        $.ajax({
          method: 'POST',
          url: 'api/bids',
          headers: {'Content-Type': 'application/json'},
          data: JSON.stringify(user),
          success: function(items) {
            var winningBids = [];
            var losingBids = [];
            items.forEach(function(item) {
              if (item.myBid.price === item.highestBid) {
                winningBids.push(item);
              } else {
                losingBids.push(item);
              }
            });
            console.log('bids are', winningBids, losingBids);
            context.setState({ //TODO winningBids can't be losingBids on the same item...
              'itemsWinningBidOn': winningBids, 
              'itemsLosingBidOn': losingBids
            });
            context.render();
          }
        });
      }
    });
  }

  render() {
    return (
      <div>
        <div>
          Welcome to the dashboard!!!

        </div>

        <div> <h2>Winning Bids </h2>
          {this.state.itemsWinningBidOn.map((winningBid, index) => {
            return (<WinningBid key={index} item={winningBid}/>);
          })}
        </div>
        <div> <h2> Losing Bids </h2>
          {
            this.state.itemsLosingBidOn.map((losingBid, index) => {
              return (<LosingBid key={index} item={losingBid}/>);
            })
          }
        </div>
        <div> <h2> Items on Auction </h2>
        {this.state.itemsForSale.map((saleItem, index) => {
          return (<SaleItem key={index} item={saleItem}/>);
        }) }
        </div>
      </div>
    );
  }
}