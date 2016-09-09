import React, {Component} from 'react';
import AuctionEntry from './auctionentry.jsx';

export default class Auction extends Component {
  constructor(props) {
    super(props);
    this.state = {
      entrys: []
    };
    this.updateEntrys = this.updateEntrys.bind(this);
    this.grabAuctions = this.grabAuctions.bind(this);
  }

  componentDidMount () {
    this.grabAuctions();
  }

  updateEntrys (entryArray) {
    this.setState({
      entrys: entryArray
    });
    console.log(this.state);
  }

  grabAuctions () {
    var context = this;
    $.ajax({
      method: 'GET',
      url: '/api/allitems',
      headers: {'Content-Type': 'application/json'},
      success: function (res) {
        console.log(res);
        context.updateEntrys(res);
      }
    });
  }

  render () {
    return (
      <div>
        <h1 className="text-center">Current Auctions</h1>
        <div className="container">
          <div className="row" style={{ 'justify-content': 'space-around', 'display': 'flex', 'flexWrap': 'wrap'}}>
          {
            this.state.entrys.map((entry, i) => {
              console.log(entry);
              return (<AuctionEntry key={i} item={entry} auth={this.props.auth} />);
            })
          }
          </div>
        </div>
      </div>
    );
  }
}
