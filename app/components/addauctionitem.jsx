import React, {Component} from 'react';

export default class AddAuctionItem extends Component {

  constructor(props) {
    super(props);
    this.submitForm = this.submitForm.bind(this);
    this.state = {
      item: {}
    };
  }
  submitForm() {
    this.setState({item: {
      title: $('#item-title').val(),
      description: $('#item-desc').val(),
      endPrice: $('#end-value').val(),
      startPrice: $('#current-value').val(),
      endDate: $('#end-date').val(),
      picture: $('#image-url').val(),
    }});

    var context = this;
    $.ajax({
      method: 'GET',
      url: 'api/user_data',
      success: function(user) {
        console.log(user.user);
        $.ajax({
          method: 'POST',
          url: 'api/items',
          headers: {'Content-Type': 'application/json'},
          data: JSON.stringify({user: user.user, item: context.state.item}),
          success: function(item) {
            console.log('successfully posted item');
          },
          error: function(error) {
            console.log('error');
          }
        });
      }
    });
  }

  _onFocus(e) {
    e.currentTarget.type = 'date';
  }

  render() {
    return (
    <div style = {{margin: 50}}>
        <form className="form-horizontal">
                  <fieldset>               
                      <h2>What do you want to sell?</h2>
                      <div className="control-group">
                          <label className="control-label">Title</label>
                          <div className="controls">
                              <input id="item-title" style = {{width: 500 + 'px'}} name="title" type="text" placeholder="Enter a descriptive title" className="input-xlarge" />
                              <p className="help-block"></p>
                          </div>
                      </div>
                      <div className="control-group">
                          <label className="control-label">Provide an image</label>
                          <div className="controls">
                              <input id="image-url" style = {{width: 500 + 'px'}} name="img" type="url" placeholder="Enter an image link for the product" className="input-xlarge" />
                              <p className="help-block"></p>
                          </div>
                      </div>
                      <div className="control-group">
                          <label className="control-label">Description</label>
                          <div className="controls">
                              <textarea id="item-desc" style = {{width: 500 + 'px'}} name="description" type="description" placeholder="Enter a description for the item" />
                              <p className="help-block"></p>
                          </div>
                      </div>
                      <div className="control-group">
                          <label className="control-label">End Date</label>
                          <div className="controls">
                              <input id="end-date" style = {{width: 400 + 'px'}} name="date" type="text" placeholder='end date of auction...' onFocus = {this._onFocus} className="input-xlarge" />
                              <p className="help-block"></p>
                          </div>
                      </div>
                      <div className="control-group">
                          <label className="control-label">Current Value</label>
                          <div style = {{marginLeft: -15 + 'px'}} className="controls">
                              $   <input id="current-value" name="curr-val" type="number" step = "0.01" placeholder="Current Value"
                              className="input-xlarge" />
                              <p className="help-block"></p>
                          </div>
                      </div>
                      <div className="control-group">
                          <label className="control-label">Sale Price at End of Auction</label>
                          <div style = {{marginLeft: -15 + 'px'}} className="controls">
                              $   <input id="end-value" name="end-val" type="number" step = "0.01" placeholder="End Value"
                              className="input-xlarge" />
                              <p className="help-block"></p>
                          </div>
                      </div>
                  </fieldset>
                  <button type='button' className="btn btn-primary" onClick={this.submitForm}>Post Item</button> <button type='button' className="btn btn-primary" >Cancel</button>
              </form>
    </div>
    );
  }
}