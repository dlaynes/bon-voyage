import React, { Component } from 'react';
import { observer } from 'mobx-react';

import ExchangeRate from '../../../Libs/BonVoyage/ExchangeRate';

@observer
class TraderItemComponent extends Component {

    static getBaseTradePrice(idx, exchangeRate){
        return Math.ceil(ExchangeRate.resourcesToSpaceCredits(window.bvConfig.shipData[idx], exchangeRate) * 0.3);
    }

    getTradePrice(){
        return TraderItemComponent.getBaseTradePrice(this.props.shipId, ExchangeRate.NORMAL);
    }

    render() {

        const shipId = this.props.shipId;
        const imgUrl = window.bvConfig.iconPath+shipId+'.gif';

        return (
            <td>
                <span className="name">{this.props.shipData.name}</span>
                <img src={imgUrl} height="48" width="48" />
                <span className="text-info">{this.props.store.ships[shipId]}</span><br />
                <span className="text-error">§ {this.getTradePrice()}</span>
                <table className="mini-buttons" cellPadding="0" cellSpacing="0">
                    <tbody>
                    <tr>
                        <td><button className="text-error" onClick={this.sellOne}>-1</button></td>
                    </tr>
                    <tr>
                        <td><button className="text-error" onClick={this.sellTen}>-10</button></td>
                    </tr>
                    </tbody>
                </table>
            </td>
        )
    }

    sellOne = (event) => {
        this.sellAmount(1);
    };

    sellTen = (event) => {
        this.sellAmount(10);
    };

    sellAmount(amount){
        this.props.tryToSellShip(this.props.shipId, amount);
    }
}

export default TraderItemComponent;