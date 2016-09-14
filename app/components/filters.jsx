import React, {Component} from 'react';

export default class Filters extends Component {
  constructor (props) {
    super(props);
    this.state = {
      filters: ['Price', 'Time']
    };
  }

  componentWillMount () {
    var x = this.state.filters;
    x.push(this.props.data);
    this.setState({
      filters: x
    });
    this.render();
  }

  render () {
    return (
      <div>
        {this.state.filters.map((item) => {
          return (
            <div className="filterCriteria">
              {item}
            </div>
          )
        })}
      </div>
    );
  }
}
