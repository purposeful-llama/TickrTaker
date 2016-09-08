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
            console.log(items);
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

        <div> <h2>Winning Bids </h2> </div>
        <div style ={{background: 'rgba(211, 211, 211, 0.5)', padding: '30px', margin: '15px', borderRadius:'10px'}}>
          {this.state.itemsWinningBidOn.map((winningBid, index) => {
            return (<WinningBid key = {index} item={winningBid}/>);
          })}
        </div>
        <div> <h2> Losing Bids </h2> </div>
        <div style ={{background: 'rgba(211, 211, 211, 0.5)', padding: '15px', margin: '15px', borderRadius:'10px'}}>
          {
            this.state.itemsLosingBidOn.map((losingBid, index) => {
              return (<LosingBid key= {index} item={losingBid}/>);
            })
          }
        </div>
        <div> <h2> Items on Auction </h2> </div>
        <div style ={{background: 'rgba(211, 211, 211, 0.5)', padding: '30px', margin: '15px', borderRadius:'10px'}}>
        {this.state.itemsForSale.map((saleItem, index) => {
          return (<SaleItem key = {index} item={saleItem}/>);
        }) }
        </div>
      </div>
    );
  }
}