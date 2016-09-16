import React, {Component} from 'react';

export default class ShippingInfo extends Component {
  constructor(props) {
    super(props)
  }

  render () {
    return (
      <div className="shipping">
        <h5 payment-header>Shipping Info</h5>
        <form id="shipping-info">
          <div className="shipping-info-div">
            <span className="shipping-info-span">Full Name</span>
            <input className="shipping-info-input" type="text" id="shipping-info-name"/>
          </div>

          <div className="shipping-info-div">
            <span className="shipping-info-span">Address Line 1</span>
            <input className="shipping-info-input" type="text" id="shipping-info-address-line-1"/>
          </div>

          <div className="shipping-info-div">
            <span className="shipping-info-span">Address Line 2</span>
            <input className="shipping-info-input" type="text" id="shipping-info-address-line-2"/>
          </div>

          <div className="shipping-info-div">
            <span className="shipping-info-span">City</span>
            <input className="shipping-info-input" type="text" id="shipping-info-city"/>
          </div>

          <div className="shipping-info-div">
            <span className="shipping-info-span">State/Province/Region</span>
            <input className="shipping-info-input" type="text" id="shipping-info-state"/>
          </div>

          <div className="shipping-info-div">
            <span className="shipping-info-span">ZIP</span>
            <input className="shipping-info-input" type="text" id="shipping-info-zip"/>
          </div>

          <div className="shipping-info-div">
            <span className="shipping-info-span">Country</span>
            <input className="shipping-info-input" type="text" id="shipping-info-country"/>
          </div>

          <div className="shipping-info-div">
            <span className="shipping-info-span">Phone Number</span>
            <input className="shipping-info-input" type="text" id="shipping-info-phone-number"/>
          </div>
        </form>
      </div>
    );
  }
}