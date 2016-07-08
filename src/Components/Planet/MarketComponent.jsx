import React, { Component } from 'react';

class MarketComponent extends Component {

    render() {

        return (
            <div className={this.props.visibility?'':'hidden'}>
                <h4>Market</h4>
                <p>Nothing to buy!</p>
            </div>
        );
    }
}

export default MarketComponent;