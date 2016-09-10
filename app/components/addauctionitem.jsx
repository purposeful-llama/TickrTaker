import React, {Component} from 'react';
import {browserHistory} from 'react-router';


export default class AddAuctionItem extends Component {

  constructor(props) {
    super(props);
    this.submitForm = this.submitForm.bind(this);
    this.cancelForm = this.cancelForm.bind(this);
    this.state = {
      item: {}
    };
  }

  componentDidMount() {
    if ( !this.props.auth() ) {
      browserHistory.push('/');
    }
    $('.alert .close').on('click', function(e) {
      $(this).parent().hide();
    });
  }

  submitForm(e) {
    e.preventDefault();
    var valid = true;
    var filter = function validateURL(textval) {
      var urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
      return urlregex.test(textval);
    };
    $('#item-name-error').hide();
    $('#item-img-null-error').hide();
    $('#item-img-valid-error').hide();
    $('#item-desc-error').hide();
    $('#item-edate-null-error').hide();
    $('#item-cval-over-error').hide();
    $('#item-eval-over-error').hide();
    if ($('#item-title').val() === '') {
      $('#item-name-error').show();
      valid = false;
    }
    if ($('#image-url').val() === '') {
      $('#item-img-null-error').show();
      valid = false;
    } else if (!filter($('#image-url').val())) {
      $('#item-img-valid-error').show();
      valid = false;
    }
    if ($('#item-desc').val() === '') {
      $('#item-desc-error').show();
      valid = false;
    }
    if ($('#end-date').val() === '') {
      $('#item-edate-null-error').show();
      valid = false;
    }
    if ($('#current-value').val() < $('#end-value').val()) {
      $('#item-cval-over-error').show();
      $('#item-eval-over-error').show();
      valid = false;
    }
    if ($('#current-value').val() === '') {
      $('#item-cval-null-error').show();
      valid = false;
    }
    if ($('#end-value').val() === '') {
      $('#item-eval-null-error').show();
      valid = false;
    }
    if (valid === true) {

      this.setState({item: {
        title: $('#item-title').val(),
        description: $('#item-desc').val(),
        endPrice: $('#end-value').val(),
        startPrice: $('#current-value').val(),
        endDate: $('#end-date').val(),
        picture: $('#image-url').val(),
      }});

      var context = this;
      $.ajax({                //TODO: we should not have to do this
        method: 'GET',        //once authenticated, we don't have to send 'user'
        url: 'api/user_data', //it should be available as req.user on the server-side
        success: function(user) {
          console.log(user.user);
          $.ajax({
            method: 'POST',
            url: 'api/items',
            headers: {'Content-Type': 'application/json'},
            data: JSON.stringify({user: user.user, item: context.state.item}),
            success: function(item) {
              console.log('successfully posted item');
              browserHistory.push('/dashboard');

            },
            error: function(error) {
              console.log('error');
            }
          });
        }
      });
    }
  }

  _onFocus(e) {
    e.currentTarget.type = 'date';
  }

  cancelForm() {
    browserHistory.push('/dashboard');
  }

  render() {
    
    return (
    <div id="add-auction-item">
        <form id='item-form' className="form-horizontal" onSubmit={this.submitForm}>
                  <fieldset>               
                      <h2>What do you want to sell?</h2>
                      <div className="control-group">
                          <label className="control-label">Title</label>
                          <div className="controls col-xs-12">
                              <input id="item-title" name="title" type="text" placeholder="Enter a descriptive title" className="input-xlarge" />
                              <p className="help-block"></p>
                          </div>
                          <div className="alert alert-danger fade in" role="alert" id="item-name-error">
                              <button type="button" className="close">×</button>
                              <strong>Woah! </strong>Please name the item. <small>Tip: Try to be as descriptive as possible!</small>
                          </div>
                      </div>
                      <div className="control-group">
                          <label className="control-label">Provide an image</label>
                          <div className="controls">
                              <input id="image-url" name="img" type="url" placeholder="Enter an image link for the product" className="input-xlarge" />
                              <p className="help-block"></p>
                          </div>
                          <div className="alert alert-danger fade in" role="alert" id="item-img-null-error">
                              <button type="button" className="close">×</button>
                              <strong>Woah! </strong>Please provide an image. <small>Tip: Upload an image to imgur.com and link it!</small>
                          </div>
                          <div className="alert alert-danger fade in" role="alert" id="item-img-valid-error">
                              <button type="button" className="close">×</button>
                              <strong>Woah! </strong>Please provide a valid image url. <small>Tip: Copy paste your url again!</small>
                          </div>
                      </div>
                      <div className="control-group">
                          <label className="control-label">Description</label>
                          <div className="controls">
                              <textarea id="item-desc" name="description" type="description" placeholder="Enter a description for the item" />
                              <p className="help-block"></p>
                          </div>
                          <div className="alert alert-danger fade in" role="alert" id="item-desc-error">
                              <button type="button" className="close">×</button>
                              <strong>Woah! </strong>Please provide a description. <small>Tip: Items with informative descriptions tend to sell faster!</small>
                          </div>
                      </div>
                      <div className="control-group">
                          <label className="control-label">End Date</label>
                          <div className="controls">
                              <input id="end-date" name="date" type="text" placeholder='end date of auction...' onFocus = {this._onFocus} className="input-xlarge" />
                              <p className="help-block"></p>
                          </div>
                          <div className="alert alert-danger fade in" role="alert" id="item-edate-null-error">
                              <button type="button" className="close">×</button>
                              <strong>Woah! </strong>Please provide a valid date. <small>Tip: Give your buyers a good time margin before the item validity expires!</small>
                          </div>
                      </div>
                      <div className="control-group">
                          <label className="control-label">Current Value</label>
                          <div id="add-auction-prices" className="controls">
                              $&nbsp;&nbsp;&nbsp;<input id="current-value" name="curr-val" type="number" step = "0.01" placeholder="Current Value"
                              className="input-xlarge" />
                              <p className="help-block"></p>
                          </div>
                          <div className="alert alert-danger fade in" role="alert" id="item-cval-null-error">
                              <button type="button" className="close">×</button>
                              <strong>Woah! </strong>Please provide a current value price. <small>Tip: Set a reasonable start price.</small>
                          </div>
                          <div className="alert alert-danger fade in" role="alert" id="item-cval-over-error">
                              <button type="button" className="close">×</button>
                              <strong>Woah! </strong>Current value price must be higher than the end value price. <small>Tip: Set a start price above the end price!</small>
                          </div>
                      </div>
                      <div className="control-group">
                          <label className="control-label">Sale Price at End of Auction</label>
                          <div id="add-auction-prices" className="controls">
                              $&nbsp;&nbsp;&nbsp;<input id="end-value" name="end-val" type="number" step = "0.01" placeholder="End Value"
                              className="input-xlarge" />
                              <p className="help-block"></p>
                          </div>
                          <div className="alert alert-danger fade in" role="alert" id="item-eval-null-error">
                              <button type="button" className="close">×</button>
                              <strong>Woah! </strong>Please provide an item end value price. <small>Tip: Set the end value price to what you are willing to sell the item for if push comes to shove.</small>
                          </div>
                          <div className="alert alert-danger fade in" role="alert" id="item-eval-over-error">
                              <button type="button" className="close">×</button>
                              <strong>Woah! </strong>End value price must be lower than the current value price.<small>Tip: Set an end price below the start price!</small>
                          </div>
                      </div>
                  </fieldset>
                  <button type='submit' id='post-item-submit' className="btn btn-primary" >Post Item</button> <button onClick={this.cancelForm} type='button' className="btn btn-primary" >Cancel</button>
              </form>
    </div>
    );
  }
}