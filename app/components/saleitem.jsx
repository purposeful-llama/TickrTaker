import React, {Component} from 'react';
import {Link} from 'react-router';


export default class SaleItem extends Component {
  constructor (props) {
    super(props);
    this.state = {
      currentBid: undefined,
      currentPrice: undefined
    };
    this.calcPrice = this.calcPrice.bind(this);
    console.log(this.props.item);
  }

  componentDidMount () {
    this.setState({
      currentPrice: '$  ' + this.calcPrice().toFixed(2),
      timeRemaing: this.calcTime(),
    });
    this.interval = setInterval(() => this.setState({
      currentPrice: '$  ' + this.calcPrice().toFixed(2),
      timeRemaing: this.calcTime()
    }), 1000);
    this.calcPrice = this.calcPrice.bind(this);
    this.calcTime = this.calcTime.bind(this);

  }
  componentWillUnmount () {
    this.interval && clearInterval(this.interval);
    this.interval = false;
  }


  calcPrice () {

    var cal = ((this.props.item.startPrice - this.props.item.endPrice) /
    ((Date.parse(this.props.item.endDate) + 2.592e+9) - Date.parse(this.props.item.startDate))) * (Date.parse(this.props.item.endDate) + 2.592e+9 - Date.now());
    return cal;
  }

  calcTime () {
    var duration = Date.parse(this.props.item.endDate) + 2.592e+9 - Date.now();
    var seconds = parseInt((duration / 1000) % 60);
    var minutes = parseInt((duration / (1000 * 60)) % 60);
    var hours = parseInt((duration / (1000 * 60 * 60)) % 24);
    var days = parseInt(((duration) / (1000 * 60 * 60 * 24)) % 365);

    days = (days < 10) ? '0' + days : days;
    hours = (hours < 10) ? '0' + hours : hours;
    minutes = (minutes < 10) ? '0' + minutes : minutes;
    seconds = (seconds < 10) ? '0' + seconds : seconds;
    return days + ' days  ' + hours + ':' + minutes + ':' + seconds + ' hours';
  }

  render () {
    var button;
    var id = '/item/' + this.props.item.id;
    return (
      <div style={{margin: '20px', width: '400px', textAlign: 'center'}}className='auction-entry-container col-md'>
        <h3>{this.props.item.title || 'Sample Title'}</h3>
        <div>
          <img src={this.props.item.picture}></img>
        </div>
        <table style= {{width: '100%', textAlign: 'center', marginBottom: '20px'}}>
          <tbody>
          <tr>
            <td><small>Time Left: </small></td><td><small>{this.state.timeRemaing}</small></td>
          </tr>
          <tr>
            <td>Current Price: </td><td>{this.state.currentPrice}</td>
          </tr>

          </tbody>
        </table>
          <div>
            <Link className='btn btn-primary' to={id}> Additional Item Info </Link>
          </div>        
      </div>
    );
  }
}