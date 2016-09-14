import React, {Component} from 'react';
import WinningBid from './winningBid.jsx';
import LosingBid from './losingBid.jsx';
import SaleItem from './saleItem.jsx';

export default class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      itemsForSale: [],
      itemsWinningBidOn: [],
      itemsLosingBidOn: [],
      toggleWinning: true,
      toggleLosing: false,
      toggleOnAuction: false
    };
    this._toggleWinning = this._toggleWinning.bind(this);
    this._toggleLosing = this._toggleLosing.bind(this);
    this._toggleOnAuction = this._toggleOnAuction.bind(this);
  }

  componentDidMount() {    //   Retrieve user data form, show items seller items on dashboard page
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
            //console.log('items are', items);
            context.setState({'itemsForSale': items});
          },
          error: function(err) {
            console.log(err);
          }
        });
 
        $.ajax({          // Retrieve data to show user's winnig and losingg bid on dashboard page
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
            //console.log('bids are', winningBids, losingBids);
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

  _toggleWinning() {
    this.setState({
      toggleWinning: true,
      toggleLosing: false,
      toggleOnAuction: false
    })
  }

  _toggleLosing() {
    this.setState({
      toggleWinning: false,
      toggleLosing: true,
      toggleOnAuction: false
    })
  }

  _toggleOnAuction() {
    this.setState({
      toggleWinning: false,
      toggleLosing: false,
      toggleOnAuction: true
    })
  }

  render() {
    return (
      <div>

        <div className="col-md-2 sidebar">
          <h5>Your Account</h5>
            <ul className="no-bullets">
              <li onClick={this._toggleWinning}>Winning Bids</li>
              <li onClick={this._toggleLosing}>Losing Bids</li>
              <li onClick={this._toggleOnAuction}>Items on Auction</li>
            </ul>

        </div>
        <div className="col-md-8 off-set-2">
        {this.state.toggleWinning ? 
          <div className="bid-container">
          <h3>Winning Bids</h3>
            {this.state.itemsWinningBidOn.map((winningBid, index) => {
              return (<WinningBid key={index} parity={index % 2} item={winningBid}/>);
              })
            }
          </div> : null}
        {this.state.toggleLosing ?
          <div className="bid-container" >
          <h3>Losing Bids</h3>
            {this.state.itemsLosingBidOn.map((losingBid, index) => {
                return (<LosingBid key={index} parity={index % 2} item={losingBid}/>);
              })
            }
          </div> : null}
        {this.state.toggleOnAuction ?
          <div className="bid-container">
          <h3>Items on Auction</h3>
            {this.state.itemsForSale.map((saleItem, index) => {
              return (<SaleItem old={true} key={index} parity={index % 2} item={saleItem}/>);
              }) 
            }
          </div> : null}
        </div>
      </div>
    );
  }
}

        