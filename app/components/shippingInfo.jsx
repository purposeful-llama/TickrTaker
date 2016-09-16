import React, {Component} from 'react';

export default class ShippingInfo extends Component {
  constructor(props) {
    super(props)
  }

  render () {
    return (
      <div>
        <h5>Shipping Info</h5>
        <form>
          <div className="shipping-info-div">
            <span className="shipping-info-span">Full Name</span>
            <input className="shipping-info-input" type="text" />
          </div>

          <div className="shipping-info-div">
            <span className="shipping-info-span">Address Line 1</span>
            <input className="shipping-info-input" type="text" />
          </div>

          <div className="shipping-info-div">
            <span className="shipping-info-span">Address Line 2</span>
            <input className="shipping-info-input" type="text" />
          </div>

          <div className="shipping-info-div">
            <span className="shipping-info-span">City</span>
            <input className="shipping-info-input" type="text" />
          </div>

          <div className="shipping-info-div">
            <span className="shipping-info-span">State/Province/Region</span>
            <input className="shipping-info-input" type="text" />
          </div>

          <div className="shipping-info-div">
            <span className="shipping-info-span">ZIP</span>
            <input className="shipping-info-input" type="text" />
          </div>

          <div className="shipping-info-div">
            <span className="shipping-info-span">Country</span>
            <input className="shipping-info-input" type="text" />
          </div>

          <div className="shipping-info-div">
            <span className="shipping-info-span">Phone Number</span>
            <input className="shipping-info-input" type="text" />
          </div>
        </form>
      </div>
    );
  }
}