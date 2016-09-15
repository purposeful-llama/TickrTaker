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
      url: 'api/messages',
      query: {
        user: this.props.userId
      },
      success: function(messages) {
        //filter messages as a buyer and as a seller
        console.log('what is messages like? ------>', messages);
        //this.setState({
        //   buyerMessages: '...',
        //   sellerMessages: '...',
        // });
      },
      error: function(err) {
        console.log('There is an error, it\'s a sad day D=');
      }
    });

  }

  render() {
    return (
        <div>
          <h5>Your Listing</h5>
            {this.state.sellerMessages.map((item, index) => {
              return (
                <Message isSeller={true} message={item} key={index} parity={index % 2}/>
                );
            })
          }
          <h5>Other items</h5>
            {this.state.buyerMessages.map((item, index) => {
              return (
                  <Message isSeller={false} message={item} key={index} parity={index % 2}/>
                );
            })}
        </div>
      );
  }
}