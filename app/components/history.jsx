import React, {Component} from 'react';
import WinningBid from './winningBid.jsx';
import LosingBid from './losingBid.jsx';
import SaleItem from './saleItem.jsx';

export default class History extends Component {
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
          url: 'api/oldselleritems',
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
          url: 'api/oldbids',
          headers: {'Content-Type': 'application/json'},
          data: JSON.stringify(user),
          success: function(items) {
            console.log('these are old bid items', items);
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
        <div className="dashboard-header col-xs-12"> <h2>Items You Have Won </h2> </div>
        <div className="col-xs-12 bid-container">
          {this.state.itemsWinningBidOn.map((winningBid, index) => {
            return (<WinningBid old={true} key={index} parity={index % 2} item={winningBid}/>);
          })}
        </div>
        <div className = "dashboard-header col-xs-12"> <h2>Items You Have Lost </h2> </div>
        <div className="col-xs-12 bid-container" >
          {
            this.state.itemsLosingBidOn.map((losingBid, index) => {
              return (<LosingBid old={true} key={index} parity={index % 2} item={losingBid}/>);
            })
          }
        </div>
        <div className="dashboard-header col-xs-12"> <h2> Items You have Sold </h2> </div>
        <div className="col-xs-12 bid-container">
        {this.state.itemsForSale.map((saleItem, index) => {
          return (<SaleItem old={true} key={index} parity={index % 2} item={saleItem}/>);
        }) }
        </div>
      </div>
    );
  }
}