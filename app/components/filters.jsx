import React, {Component} from 'react';
import FilterEntry from './filterEntry.jsx';

export default class Filters extends Component {
  constructor (props) {
    super(props);
    this.state = {
                  filters: {
                    'Price': [
                      // Can this be calculated by the server?
                    ],
                    'Time': [
                      // Ends in...
                      '1 hour', '1 day', '1 week' 
                    ],
                    'Categories': [
                      'Books & Audible', 'Movies, Music & Games', 'Electronics & Computers', 'Home, Garden & Tools', 'Beauty, Health & Grocery', 'Toys, Kids & Baby', 'Clothing, Shoes & Jewelry', 'Sports & Outdoors', 'Automotive & Industrial'
                    ]
                  }
    };
  }

  // componentWillMount () {
  //   var x = this.state.filters;
  //   x.push(this.props.data);
  //   this.setState({
  //     filters: x
  //   });
  //   this.render();
  // }

  render () {
    return (
      <div>
        <h2>Show results for:</h2>

        {/*this.state.filters.Price.map((item) => {
          return (
            <div className="filterCriteria">
              <FilterEntry filter={item} />
            </div>
          )
        })*/}
        <br />
        <h4>Categories</h4>
        <p className="clearFilter filter-entry filterCriteria" onClick={this.props.clearFilter}>All Categories</p>
        {this.state.filters.Categories.map((item) => {
          return (
            <div className="filterCriteria">
              <FilterEntry clickHandler={this.props.clickHandlerCategory} filter={item} />
            </div>
          )
        })}
        <br />
        <h4>Time</h4>
        <p className="clearFilter filter-entry filterCriteria" onClick={this.props.clearFilter}>Anytime</p>
        {this.state.filters.Time.map((item) => {
          return (
            <div className="filterCriteria">
              <FilterEntry clickHandler={this.props.clickHandlerTime} filter={item} />
            </div>
          )
        })}
      </div>
    );
  }
}
