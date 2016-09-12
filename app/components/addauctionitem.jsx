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
    var context = this;
    if ( !this.props.auth() ) {
      browserHistory.push('/');
    }
    $('.alert .close').on('click', function(e) {
      $(this).parent().hide();
    });
    
    $('#upload_widget_opener').cloudinary_upload_widget(
        { cloud_name: 'dijpyi6ze', upload_preset: 'emhtsrjh', theme: 'minimal', folder: 'item_photos', button_class: 'btn btn-primary' },
        function(error, result) { 
          console.log(error, result); 
          context.setState({item: {
            picture: result[0].secure_url
          }});
          //console.log(context.state.item.picture);
        });
  }

  submitForm(e) {                  //  Regex code to check if url is valid or not
    e.preventDefault();
    var valid = true;
    var filter = function validateURL(textval) {
      var urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
      return urlregex.test(textval);
    };
    $('#item-name-error').hide();                //  After each submit, hide error messages
    $('#item-img-null-error').hide();
    $('#item-img-valid-error').hide();
    $('#item-desc-error').hide();
    $('#item-edate-null-error').hide();
    $('#item-cval-over-error').hide();
    $('#item-eval-over-error').hide();

    if ($('#item-title').val() === '') {        //  Show error message in case of invalid item name
      $('#item-name-error').show();
      valid = false;
    }
    if ($('#item-desc').val() === '') {         //  Show error message in case of invalid item description
      $('#item-desc-error').show();
      valid = false;
    }
    if ($('#end-date').val() === '' || Date.parse($('#end-date').val()) < Date.now()) {       //  Show error message if end date is not valid
      $('#item-edate-null-error').show();
      valid = false;
    }
    if (Number($('#current-value').val()) < Number($('#end-value').val())) {    //  Compare current and end value and show error message if it is not valid
      $('#item-cval-over-error').show();
      $('#item-eval-over-error').show();
      valid = false;
    }
    if ($('#current-value').val() === '') {     //  Show error message in case of invalid current value
      $('#item-cval-null-error').show();
      valid = false;
    }
    if ($('#end-value').val() === '') {        //  Show error message in case of invalid end value
      $('#item-eval-null-error').show();
      valid = false;
    }
    if (valid === true) {          // If all inputs are valid, retrive the values from input field ans set state

      this.setState({item: {
        title: $('#item-title').val(),
        description: $('#item-desc').val(),
        endPrice: Number($('#end-value').val()),
        startPrice: Number($('#current-value').val()),
        endDate: $('#end-date').val() + ' PST',
        picture: this.state.item.picture,


      }});
      //console.log(this.state.item);
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
    <div className="flex-items-xs-center">
      <div className="col-xs-3"></div>
      <div id="add-auction-item" className="col-md-6 col-xs-12">
        <form id='item-form' className="form-horizontal" onSubmit={this.submitForm}>
          <fieldset>
            <h2>What do you want to sell?</h2>
            <div className="control-group">
              <label className="control-label">Title</label>
              <div className="controls">
                <input id="item-title" name="title" type="text" placeholder="Enter a descriptive title..." className="input-xlarge" />
                <p className="help-block"></p>
              </div>
              <div className="alert alert-danger fade in" role="alert" id="item-name-error">
                <button type="button" className="close">×</button>
                <strong>Woah! </strong>Please name the item. <small>Tip: Try to be as descriptive as possible!</small>
              </div>
            </div>
            <div className="control-group">
              <label className="control-label no-margin">Provide an image</label>
              <div className="controls">
                <button id="upload_widget_opener" className="btn btn-primary">Upload multiple images</button>
                <p className="help-block"></p>
              </div>
              <div className="alert alert-danger fade in" role="alert" id="item-img-null-error">
                <button type="button" className="close">×</button>
                <strong>Woah! </strong>Please provide an image. <small>Tip: Upload an image to imgur.com and link it!</small>
              </div>
            </div>
            <div className="control-group">
              <label className="control-label">Description</label>
              <div className="controls">
                <textarea id="item-desc" rows='5' name="description" type="description" placeholder="Enter a description for the item..." />
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
                <input id="end-date" name="date" type="text" placeholder='end date of auction...' onFocus={ this._onFocus} className="input-xlarge" />
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
                $&nbsp;
                <input id="current-value" name="curr-val" type="number" step="0.01" placeholder="Current Value" className="input-xlarge" />
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
              <label className="control-label">Minimum Value</label>
              <div id="add-auction-prices" className="controls">
                $&nbsp;
                <input id="end-value" name="end-val" type="number" step="0.01" placeholder="End Value" className="input-xlarge" />
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
            <div className = "row auction-button-container">
              <div className = "col-xs-5">
              <button type='submit' id='post-item-submit' className="btn btn-primary col-xs">Post Item</button>
              </div>
              <div className = "col-xs-5">
              <button onClick={this.cancelForm} type='button' className="btn btn-primary col-xs">Cancel</button>
              </div>
            </div>
        </form>
      </div>
      <div className="col-xs-3"></div>

    </div>
); }

}