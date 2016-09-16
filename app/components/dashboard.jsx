import React, {Component} from 'react';
import WinningBid from './winningBid.jsx';
import LosingBid from './losingBid.jsx';
import SaleItem from './saleItem.jsx';
import Inbox from './inbox.jsx';
import ManageFAQ from './manageFAQ.jsx';
import ItemsWon from './itemsWon.jsx';

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
    this.submitPayment = this.submitPayment.bind(this);
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

  // handles storing shipping info in user table and sending payment info to stripe api
  submitPayment (e) {
    e.preventDefault();
    console.log('made it in life');
    
    // ajax request for payment info
    var $form = $('#payment-form');
    $form.submit(function(e) {
      e.preventDefault();
      console.log(e, 'stuff got submitted');
      // Disable the submit button to prevent repeated clicks:
      $form.find('.submit').prop('disabled', true);

      // Request a token from Stripe:
      Stripe.card.createToken($form, stripeResponseHandler);

      // Prevent the form from being submitted:
      return false;
    });

    // ajax request for shipping info
    var name = $('#shipping-info-name').val();
    var addressLine1 = $('#shipping-info-address-line-1').val();
    var addressLine2 = $('#shipping-info-address-line-2').val();
    var city = $('#shipping-info-city').val();
    var state = $('#shipping-info-state').val();
    var zip = $('#shipping-info-zip').val();
    var country = $('#shipping-info-country').val();
    var phoneNumber = $('#shipping-info-phone-number').val();

    var shipping = {
      userId: this.state.userId,
      name: name,
      addressLine1: addressLine1,
      addressLine2: addressLine2,
      city: city,
      state: state,
      zip: zip,
      country: country,
      phoneNumber: phoneNumber
    };

    // Test
    console.log(shipping);

    $.ajax({
      method: 'POST',
      url: 'api/user_data',
      headers: {'Content-Type': 'application/json'},
      data: JSON.stringify(shipping),
      success: function () {
        console.log('Your shipping info has been saved');
      },
      error: function (error) {
        console.log(error);
      }
    });

    $.ajax({
      method: 'POST',
      url: 'https://api.stripe.com',
      data: shipping,
      success: function (status, response) {
        var $form = $('#payment-form');

        if (response.error) { // Problem!

          // Show the errors on the form:
          $form.find('.payment-errors').text(response.error.message);
          $form.find('.submit').prop('disabled', false); // Re-enable submission

        } else { // Token was created!

          // Get the token ID:
          var token = response.id;

          // Insert the token ID into the form so it gets submitted to the server:
          $form.append($('<input type="hidden" name="stripeToken">').val(token));

          // Submit the form:
          $form.get(0).submit();
        }
      }
    });
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
          <div>
            <ItemsWon userId={this.state.userId} submitPayment={this.submitPayment}/>
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

