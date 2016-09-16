import React, {Component} from 'react';

export default class Payment extends Component {
  constructor(props) {
    super(props);
  }

  render () {
    return (
      <div className="col-xs-12 bid-container">
        <h5>Payment Info</h5>
        <div>
          <form action="/your-charge-code" method="POST" id="payment-form">
            <span class="payment-errors"></span>

            <div class="form-row">
              <label>
                <span>Name On Card</span>
                <input type="text" size="20" data-stripe="number" />
              </label>
            </div>

            <div class="form-row">
              <label>
                <span>Card Number</span>
                <input type="text" size="20" data-stripe="number" />
              </label>
            </div>

            <div class="form-row">
              <label>
                <span>Expiration (MM/YY)</span>
                <input type="text" size="2" data-stripe="exp_month" />
              </label>
              <span> / </span>
              <input type="text" size="2" data-stripe="exp_year" />
            </div>

            <div class="form-row">
              <label>
                <span>CVC</span>
                <input type="text" size="4" data-stripe="cvc" />
              </label>
            </div>


            <input type="submit" class="submit" value="Submit Payment" />
          </form>
        </div>
      </div>
    );
  }
}