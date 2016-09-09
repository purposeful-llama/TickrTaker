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

  grabAuctions (e) {
    e && e.preventDefault();
    var context = this;
    var filter = '';
    console.log($('#search').val());
    if ($('#search').val() !== '') {
      filter = $('#search').val();
    }
    $.ajax({
      method: 'GET',
      data: {
        search: filter
      },
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
          <div className="row">
            <form onSubmit={this.grabAuctions.bind(this)}>
              <div className="col-xs-2">Search: </div>
              <input id="search" className="col-xs-8" />
            </form>
          </div>
          <div className="row" style={{ 'justifyContent': 'space-around', 'display': 'flex', 'flexWrap': 'wrap'}}>
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
