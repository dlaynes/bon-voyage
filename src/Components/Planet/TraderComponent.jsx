import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { observable } from 'mobx';

import ExchangeRate from '../../Libs/BonVoyage/ExchangeRate';

import TraderItemComponent from './Trader/TraderItemComponent';

import Fleet from '../../Libs/BonVoyage/Model/Fleet';

@observer
class TraderComponent extends Component {

    @observable success = false;
    @observable validating = false;
    @observable cannotSellAllShips = false;

    validShipIds = Fleet.validConstructibleShips;

    render() {

        return (
            <div className={this.props.visibility?'':'hidden'}>
                <h4>Trader</h4>
                <p>You can exchange your ships for Space Credits here.<br />
                    <span className="text-warning">Pay attention to your Fleet Capacity or else you might lose resources</span></p>
                <table className="tbl-ships tbl-ships-space">
                    <tbody>
                        <tr>
                        {this.validShipIds.map((x, i) =>
                            <TraderItemComponent store={this.props.store}
                                                 key={'traderInput-'+x}
                                                 shipData={this.props.priceList[x]}
                                                 shipId={x}
                                                 tryToSellShip={this.tryToSellShip} />
                        )}
                        </tr>
                    </tbody>
                </table>
                <br />
                <div>
                    <span className={this.cannotSellAllShips?'text-error':'hidden'}>
                        You need at least one ship available!</span>
                    <span className={this.success?'text-success':'hidden'}>Thank you!</span>
                    <span className={this.validating?'text-error':'hidden'}>Not enough Ships!</span>
                </div>
            </div>
        );
    }

    tryToSellShip = (idx, amount) => {
        //Hardcoded decimal!!
        const sellingPrice
            = TraderItemComponent.getBaseTradePrice(idx, ExchangeRate.NORMAL) * amount,
            currentAmount = this.props.store.ships[idx],
            totalShips = this.props.store.shipCount;

        if(amount < totalShips){
            if(amount > currentAmount){
                
                this.cannotSellAllShips = false;
                this.success = false;
                this.validating = true;
            
            } else {
                this.props.store.spaceCredits += sellingPrice;
                this.props.store.changeShipAmount(idx, currentAmount - amount);
                this.props.store.setResources({
                    metal:this.props.store.metal,
                    crystal:this.props.store.crystal,
                    deuterium: this.props.store.deuterium}); /* Small hack */
                
                this.cannotSellAllShips = false;
                this.validating = false;
                this.success = true;
            }
        } else if(amount == totalShips) {

            this.success = false;
            this.validating = false;
            this.cannotSellAllShips = true;
        
        } else {

            this.cannotSellAllShips = false;
            this.success = false;
            this.validating = true;
        }
        setTimeout(() => {
            this.cannotSellAllShips = false;
            this.validating = false;
            this.success = false;
        }, 3000);
    };
}

export default TraderComponent;