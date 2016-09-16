import React, {Component} from 'react';

export default class Payment extends Component {
  constructor(props) {
    super(props);
  }

  // the submit is parsed by stripe functions
  render () {
    return (
      <div className="payment">

        {Stripe.setPublishableKey('pk_test_UahXVPVR1lOrfFKhQIxrY5re')}
        
        <h5 className="payment-header">Payment Info</h5>
        <form onSubmit={this.props.submitPayment} method="POST" id="payment-form">

          <div className="payment-div">
            <label>
              <span className="payment-span">Name On Card</span>
              <input className="payment-input" type="text" size="20" data-stripe="number" />
            </label>
          </div>

          <div className="payment-div">
            <label>
              <span className="payment-span">Card Number</span>
              <input className="payment-input" type="text" size="20" data-stripe="number" />
            </label>
          </div>

          <div className="payment-div">
            <label>
              <span className="payment-span">Expiration (MM/YY)</span>
              <input className="payment-input" type="text" size="2" data-stripe="exp_month" />
            </label>
            <span className="payment-span"> / </span>
            <input className="payment-input" type="text" size="2" data-stripe="exp_year" />
          </div>

          <div className="payment-div">
            <label>
              <span className="payment-span">CVC</span>
              <input className="payment-input" type="text" size="4" data-stripe="cvc" />
            </label>
          </div>

          <input type="submit" className="submit" value="Submit Payment" />

          <span className="payment-span payment-errors"></span>
        </form>
      </div>
    );
  }
}