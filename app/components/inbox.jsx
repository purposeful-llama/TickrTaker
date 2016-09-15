import React, {Component} from 'react';
import Message from './message.jsx';


export default class Inbox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      buyerMessages: ['buyer messge one', 'buyer message two'],
      sellerMessages: ['seller message', 'seller message two']
    };
  }

  componentDidMount() {
    $.ajax({
      method: 'GET',
      url: 'api/messages' + this.props.userId,
      success: function(messages) {
        //filter messages as a buyer and as a seller
        console.log('what is messages like? ------>', messages);
        messages.forEach(function(item) {
          if (item.isSeller) {
            var entry = {
              subject: item.subject,
              message: item.message
            };
            this.setState({sellerMessages: entry});
          } else {
            var entry = {
              subject: item.subject,
              message: item.message
            };
            this.setState({buyerMessages: entry});
          }
        });
      },
      error: function(err) {
        console.log('There is an error, it\'s a sad day D=');
      }
    });

  }

  render() {
    return (
        <div className="col-md-12">
          <h5>Your Auction Listing</h5>
            {this.state.sellerMessages.map((item, index) => {
              return (
                <Message isSeller={true} subject={item.subject} message={item.message} key={index} parity={index % 2}/>
                );
            })
          }
          <h5>Auctions you are interested in</h5>
            {this.state.buyerMessages.map((item, index) => {
              return (
                  <Message isSeller={false} subject={item.subject} message={item.message} key={index} parity={index % 2}/>
                );
            })}
        </div>
      );
  }
}