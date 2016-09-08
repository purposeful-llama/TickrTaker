import React, {Component} from 'react';

import {WinningBid} from './WinningBid.jsx';
import {LosingBid} from './LosingBid.jsx';


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
        <div> {this.state.itemsForSale.map((item) => {
          console.log(item);
          return (<SaleItem item={item}/>);
        }) }
        </div>
        <div>
          {this.state.itemsWinningBidOn.map((item) => {
            console.log(item);
            return (<WinningBid/>);
          })}
        </div>
        <div>
          {
            this.state.itemsLosingBidOn.map((item) => {
              console.log(item);
              return (<LosingBid/>);
            })
  }
        </div>
      </div>
    );
  }
}