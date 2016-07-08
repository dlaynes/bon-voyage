import React, { Component } from 'react';

class TraderComponent extends Component {

    spaceCreditTraderPrices = {
        '202':0,
        '203':0,
        '204':0,
        '205':0,
        '206':0,
        '207':0,
        '208':0,
        '209':0,
        '210':0,
        '211':0,
        '213':0,
        '214':0, //Unused
        '215':0
    };

    render() {

        return (
            <div className={this.props.visibility?'':'hidden'}>
                <h4>Trader</h4>
                <p>You can exchange your ships for Space Credits here.</p>
            </div>
        );
    }
}

export default TraderComponent;