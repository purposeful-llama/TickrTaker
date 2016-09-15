import React, {Component} from 'react';
import WinningBid from './winningBid.jsx';
import LosingBid from './losingBid.jsx';
import SaleItem from './saleItem.jsx';
import Inbox from './inbox.jsx';
import ManageFAQ from './manageFAQ.jsx';
import Payment from './payment.jsx';

export default class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      itemsForSale: [],
      itemsWinningBidOn: [],
      itemsLosingBidOn: [],
      route: ''
    };
    this._routePage = this._routePage.bind(this);
  }

  componentDidMount() {    //   Retrieve user data form, show items seller items on dashboard page
    var context = this;
    $.ajax({
      method: 'GET',
      url: 'api/user_data',
      success: function(user) {
        context.setState({
          userId: user.user.id,
          userName: user.user.name
        });
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

  _routePage(page) {
    this.setState({route: page});
  }

  render() {
    return (
      <div>

        <div className="col-md-2 sidebar">
          <h5>Your Account</h5>
            <ul className="no-bullets">
              <li onClick={() => this._routePage('inbox')}>Inbox</li>
              <li><h5>Buying</h5></li>
              <li onClick={() => this._routePage('itemsWon')}>Items Won</li>
              <li onClick={() => this._routePage('winning')}>Winning Bids</li>
              <li onClick={() => this._routePage('losing')}>Losing Bids</li>
              <li><h6>Selling</h6></li>
              <li onClick={() => this._routePage('OnAuction')}>Items on Auction</li>
              <li onClick={() => this._routePage('manageFAQ')}>Manage Auctions FAQ</li>
            </ul>

        </div>

        <div className="col-md-8 off-set-2">
        {(this.state.route === 'itemsWon') ?
          <div className="bid-container">
          <h4>Items Won</h4>
            <Payment />
          </div> : null}

        {(this.state.route === 'winning') ? 
          <div className="bid-container">
          <h4>Winning Bids</h4>
            {this.state.itemsWinningBidOn.map((winningBid, index) => {
              return (<WinningBid key={index} parity={index % 2} item={winningBid}/>);
              })
            }
          </div> : null}

        {(this.state.route === 'losing') ?
          <div className="bid-container">
          <h4>Losing Bids</h4>
            {this.state.itemsLosingBidOn.map((losingBid, index) => {
                return (<LosingBid key={index} parity={index % 2} item={losingBid}/>);
              })
            }
          </div> : null}

        {(this.state.route === 'OnAuction') ?
          <div className="bid-container">
          <h4>Items on Auction</h4>
            {this.state.itemsForSale.map((saleItem, index) => {
              return (<SaleItem old={true} key={index} parity={index % 2} item={saleItem}/>);
              }) 
            }
          </div> : null}

          {(this.state.route === 'inbox') ?
            <div>
              <div className="bid-container">
                <h4>Inbox</h4>
              </div>
                <Inbox userId={this.state.userId} userName={this.state.userName}/>
            </div> : null}

          {(this.state.route === 'manageFAQ') ?
            <div>
              <div className="bid-container">
                <h4>Manage Auctions FAQ</h4>
                <ManageFAQ />
              </div>
            </div>: null}

        </div>
      </div>
    );
  }
}

