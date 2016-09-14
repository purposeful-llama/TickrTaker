import React, {Component} from 'react';
import FilterEntry from './filterEntry.jsx';

export default class Filters extends Component {
  constructor (props) {
    super(props);
    this.state = {
      filters: ['Price', 'Time']
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
        {this.state.filters.map((item) => {
          return (
            <div className="filterCriteria">
              <FilterEntry filter={item} />
            </div>
          )
        })}
      </div>
    );
  }
}
