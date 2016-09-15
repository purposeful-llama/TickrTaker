import React, {Component} from 'react';
import AuctionEntry from './auctionentry.jsx';
import Filters from './filters.jsx';

export default class Auction extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allEntries: [],
      entrys: []
    };
    this.updateEntrys = this.updateEntrys.bind(this);
    this.grabAuctions = this.grabAuctions.bind(this);
    this.sortEntries = this.sortEntries.bind(this);
    this.filterEntriesByCategory = this.filterEntriesByCategory.bind(this);
    this.filterEntriesByTime = this.filterEntriesByTime.bind(this);
    this.clearFilter = this.clearFilter.bind(this);
  }

  componentDidMount () {   //  Have list of auctions before rendering the page
    this.grabAuctions();
  }

  updateEntrys (entryArray) {    //  Show filtered results
    this.setState({
      entrys: entryArray,
      allEntries: entryArray
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

  filterEntriesByCategory (e) {
    var filterValue = e.target.innerHTML;
    var filtered = this.state.entrys.filter(function (entry) {
      return entry.category === filterValue;
    });
    this.setState({
      entrys: filtered
    });
  }

  filterEntriesByTime (e) {
    var filterValue = e.target.innerHTML;
    var filtered = this.state.entrys.filter(function (entry) {
      return entry.time === filterValue;
    });
    this.setState({
      entrys: filtered
    });
  }

  clearFilter(e) {
    this.setState({
      entrys: this.state.allEntries
    });
  }

  sortEntries (e) {
    e.preventDefault();
    var sorter = e.target.value;
    if (sorter !== "") {
      if (sorter === "priceHigh") {
        var x = this.state.entrys.sort(function (a, b) {
          return a.price > b.price;
        });
        this.setState({
          entrys: x
        });
      }
      if (sorter === "priceLow") {
        var x = this.state.entrys.sort(function (a, b) {
          return a.price < b.price;
        });
        this.setState({
          entrys: x
        });
      }
      if (sorter === "oldest") {
        var x = this.state.entrys.sort(function(a, b) {
          return a.startDate > b.startDate;
        });
        this.setState({
          entrys: x
        });
      }
      if (sorter === "newest") {
        var x = this.state.entrys.sort(function(a, b) {
          return a.startDate < b.startDate;
        });
        this.setState({
          entrys: x
        });
      }
    }
  }

  render () {
    return (
      <div className="row">
        <div className="col-xs-12">
          <div className="auction-header col-xs-12">
            <h3 className="col-xs-3 pull-xs-left">Current Auctions</h3>
            <div className="col-xs-5 pull-xs-right">
              <form className="search-form" onSubmit={this.grabAuctions.bind(this)}>
                <input id="search" className="col-xs-6" />
                <div className="col-xs-5 search-text">Search:</div>
              </form>
            </div>
            <div className="col-xs-3">
              <form>
                <h3></h3>
                <select onChange={this.sortEntries}>
                  <option value="">All</option>
                  <option value="priceHigh">Price: High to Low</option>
                  <option value="priceLow">Price: Low to High</option>
                  <option value="newest">Newer Items First</option>
                  <option value="oldest">Older Items First</option>
                </select>
              </form>
            </div>
          </div>
          {/*this div is for filtering by categories e.g.: price, type, time left, color, etc.
               
            */
          }
          <div className="sidebar col-md-2 filter-side">
            <Filters className="bid-container" clickHandlerCategory={this.filterEntriesByCategory} clickHandlerTime={this.filterEntriesByTime} clearFilter={this.clearFilter}/>
          </div> 
          <div className="auction-listings col-md-8 off-set-2">
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

