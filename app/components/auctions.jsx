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

  componentDidMount () {   //  Have list of auctions before rendering the page
    this.grabAuctions();
  }

  updateEntrys (entryArray) {    //  Show filtered results
    this.setState({
      entrys: entryArray
    });
    console.log(this.state);
  }

  grabAuctions (e) {         // Ajax request for auction searching by using search-bar
    e && e.preventDefault();
    var context = this;
    var filter = '';
    //console.log($('#search').val());
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
        //console.log(res);
        context.updateEntrys(res);
      }
    });
  }

  render () {
    return (
      <div className="row">
        <div className="col-xs-12">
          <div className="col-xs-12">
            <div className="auction-header col-xs-12">
              <h3 className="col-xs-4 pull-xs-left">Current Auctions</h3>
              <div className="col-xs-8 pull-xs-right">
                <form className="search-form" onSubmit={this.grabAuctions.bind(this)}>
                  <input id="search" className="col-xs-6" />
                  <div className="col-xs-6 search-text">Search:</div>
                </form>
              </div>
            </div>
          </div>
        <div className="auction-listings col-xs-12">
          {
            this.state.entrys.map((entry, i) => {
              console.log(entry);
              return (<AuctionEntry key={i} parity={i % 2} item={entry} auth={this.props.auth} />);
            })
          }
          </div>
        </div>
      </div>
    );
  }
}

