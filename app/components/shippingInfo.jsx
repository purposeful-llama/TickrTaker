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
          <div>
            <span>Full Name</span>
            <input type="text" />
          </div>

          <div>
            <span>Address Line 1</span>
            <input type="text" />
          </div>

          <div>
            <span>Address Line 2</span>
            <input type="text" />
          </div>

          <div>
            <span>City</span>
            <input type="text" />
          </div>

          <div>
            <span>State/Province/Region</span>
            <input type="text" />
          </div>

          <div>
            <span>ZIP</span>
            <input type="text" />
          </div>

          <div>
            <span>Country</span>
            <input type="text" />
          </div>

          <div>
            <span>Phone Number</span>
            <input type="text" />
          </div>
        </form>
      </div>
    );
  }
}