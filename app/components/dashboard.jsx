import React, {Component} from 'react';

import WinningBid from './WinningBid.jsx';
import LosingBid from './LosingBid.jsx';
import SaleItem from './saleitem.jsx';

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
            context.setState({'itemsForSale': items});
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
            context.setState({
              'itemsWinningBidOn': winningBids, 
              'itemsLosingBidOn': losingBids
            });
            context.render();
            console.log(context.state);
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
          {this.state.itemsWinningBidOn.map((winningBid) => {
            return (<WinningBid item={winningBid}/>);
          })}
        </div>
        <div> <h2> Losing Bids </h2>
          {
            this.state.itemsLosingBidOn.map((losingBid) => {
              return (<LosingBid item={losingBid}/>);
            })
          }
        </div>
        <div> <h2> Items on Auction </h2>
        {this.state.itemsForSale.map((saleItem) => {
          return (<SaleItem item={saleItem}/>);
        }) }
        </div>
      </div>
    );
  }
}