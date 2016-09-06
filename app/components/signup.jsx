import React, {Component} from 'react';

export default class Signup extends Component {
  render() {
    return (
      <div className="container">
        <div className="row">
           <form className="form-horizontal">
                  <fieldset>               
                      <h2>User Info</h2>
                      <div className="control-group">
                          <label className="control-label">Username</label>
                          <div className="controls">
                              <input id="user-name" name="user-name" type="text" placeholder="Enter username" className="input-xlarge" />
                              <p className="help-block"></p>
                          </div>
                      </div>
                      <div className="control-group">
                          <label className="control-label">Password</label>
                          <div className="controls">
                              <input id="user-pw" name="user-pw" type="password" placeholder="Enter password" className="input-xlarge" />
                              <p className="help-block"></p>
                          </div>
                      </div>
                      <div className="control-group">
                          <label className="control-label">Validate Password</label>
                          <div className="controls">
                              <input id="user-pw-val" name="user-pw-val" type="password" placeholder="Enter password again" className="input-xlarge" />
                              <p className="help-block"></p>
                          </div>
                      </div>
                      <div className="control-group">
                          <label className="control-label">Phone Number</label>
                          <div className="controls">
                              <input id="phone-number" name="phone-number" type="text" placeholder="Phone Number"
                              className="input-xlarge" />
                              <p className="help-block"></p>
                          </div>
                      </div>
                      <div className="control-group">
                          <label className="control-label">Email</label>
                          <div className="controls">
                              <input id="email" name="email" type="text" placeholder="Email Address"
                              className="input-xlarge" />
                              <p className="help-block"></p>
                          </div>
                      </div>

                      <h2>Address</h2>
                      <div className="control-group">
                          <label className="control-label">Address Line 1</label>
                          <div className="controls">
                              <input id="address-line1" name="address-line1" type="text" placeholder="address line 1"
                              className="input-xlarge" />
                              <p className="help-block">Street address, P.O. box, company name, c/o</p>
                          </div>
                      </div>
                      <div className="control-group">
                          <label className="control-label">Address Line 2</label>
                          <div className="controls">
                              <input id="address-line2" name="address-line2" type="text" placeholder="address line 2"
                              className="input-xlarge" />
                              <p className="help-block">Apartment, suite , unit, building, floor, etc.</p>
                          </div>
                      </div>
                      <div className="control-group">
                          <label className="control-label">City / Town</label>
                          <div className="controls">
                              <input id="city" name="city" type="text" placeholder="city" className="input-xlarge" />
                              <p className="help-block"></p>
                          </div>
                      </div>
                      <div className="control-group">
                          <label className="control-label">State / Province / Region</label>
                          <div className="controls">
                              <input id="region" name="region" type="text" placeholder="state / province / region"
                              className="input-xlarge" />
                              <p className="help-block"></p>
                          </div>
                      </div>
                      <div className="control-group">
                          <label className="control-label">Zip / Postal Code</label>
                          <div className="controls">
                              <input id="postal-code" name="postal-code" type="text" placeholder="zip or postal code"
                              className="input-xlarge" />
                              <p className="help-block"></p>
                          </div>
                      </div>
                  </fieldset>
                  <button type='submit' className="btn btn-primary">Sign Up</button>  <button type='button' className="btn btn-primary" >Cancel</button>
              </form>
        </div>
      </div>
    );
  }
}