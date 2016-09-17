import React, {Component} from 'react';
import Suggestion from './suggestions.jsx';

export default class SearchBox extends Component {
  constructor (props) {
    super(props);
    this.state = {
      text: '',
      focused: false,
      suggestions: []
    };
    this.enterText = this.enterText.bind(this);
    this.getTitles = this.getTitles.bind(this);
  }

  enterText () {
    this.setState({
      focused: !this.state.focused
    });
  }

  getTitles () {
    this.setState({
      text: document.getElementById('search').value,
      suggestions: []
    });
    var context = this;
    $.ajax({
      method: 'GET',
      url: '/api/allitems',
      headers: {'Content-Type': 'application/json'},
      success: function (res) {
        var filtered = res.filter(function (item) {
          return (item.title.includes(context.state.text));
        });
        context.setState({
          suggestions: filtered
        });
      }
    });
  }

  render () {
    return (
      <form className="search-form" onSubmit={this.props.grabAuctions}>
        <input id="search" className="col-xs-6" onFocus={this.enterText} onBlur={this.enterText} onKeyDown={this.getTitles}/>
        <div className="col-xs-5 search-text">Search:</div>
        {console.log(this.state.suggestions, 'suggestions')}
        
        {this.state.focused ? 
          <div className="suggest">
            {this.state.suggestions.map((item) =>
              <Suggestion title={item}/>
            )}
          </div> : null
        }
      </form>
    );
  }
}