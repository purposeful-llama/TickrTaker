import React, {Component} from 'react';

export default class SaleItem extends Component {
  constructor(props) {
    super(props);
    console.log(props.item);
  }

  render() {
    return (<div>
      A Sale Item
    </div>);
  }
}