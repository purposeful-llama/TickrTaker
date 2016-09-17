import React, {Component} from 'react';

export default class ManageFAQ extends Component {
  constructor(props) {
    super(props);
  }

  // componentWillMount() {
  //   //fetch FAQ, picture and title passing itemId
  //   // $.ajax({
  //   //   method: 'GET',
  //   //   url: '/api/item'
  //   // })

  // }

  render() {
    return (
      <div className="container auction-item-container">
      <div className="row">
        <div className="col-md-4">
          <img className="img-fluid" src={this.state.Item.picture}></img>
        </div>
        <div className="auction-item-details col-md-6 off-set-2">
          <h2>{thisItem.title}</h2>
          <br />
          <hr className="col-md-12 auction-item-title-hr"/>
          <br />
          <div className="col-md-12 auctionTitle">
            <h4>FAQ</h4>
            {this.state.item.map((item) => {
              return (
                  <div>
                    <p><strong>{this.state.item.questions}</strong></p>
                    <p>{this.state.item.answer}</p>
                  </div>
                );
              })
            }
          </div>
        </div>
      </div>
    </div>
    )
  }
}