import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { observable } from 'mobx';

import ExchangeRate from '../../Libs/BonVoyage/ExchangeRate';
import Fleet from '../../Libs/BonVoyage/Model/Fleet';

import ShipyardItemComponent from './Shipyard/ShipyardItemComponent';

@observer
class ShipyardComponent extends Component {
    
    @observable success = false;
    @observable successResources = false;
    @observable validating = false;
    @observable validatingResources = false;

    validShipIds = Fleet.validConstructibleShips;

    render() {

        return (
            <div className={this.props.visibility?'':'hidden'}>
                <h4>Shipyard</h4>
                <p>Interested in anything?</p>
                <table className="tbl-ships tbl-ships-space">
                    <tbody>
                    <tr>
                        {this.validShipIds.map((x, i) =>
                            <ShipyardItemComponent store={this.props.store}
                                                   key={'shipYardInput-'+x}
                                                   shipData={this.props.priceList[x]} shipId={x}
                                                   tryToIncreaseItem={this.tryToIncreaseItem}
                                                   tryToPurchaseShip={this.tryToPurchaseShip} />
                        )}
                    </tr>
                    </tbody>
                </table>
                <br />
                <div>
                    <span className={this.success?'text-success':'hidden'}>Thanks for buying!</span>
                    <span className={this.successResources?'text-success':'hidden'}>Ships built!</span>
                    <span className={this.validating?'text-error':'hidden'}>Not enough Space Credits!</span>
                    <span className={this.validatingResources?'text-error':'hidden'}>Not enough Resources!</span>
                </div>
            </div>
        )
    }

    tryToIncreaseItem = (idx, amount) => {

        this.success = false;
        this.validating = false;
        this.validatingResources = false;
        this.successResources = false;
        
        if(amount < 0){ amount = 0; }
        let spaceBuy = true, originalAmount = this.props.store.ships[idx];
        var realAmount = this.props.store.tryUsingShipAmount(idx, amount, this.props.priceList[idx], spaceBuy);
        if(realAmount > originalAmount){
            
            this.successResources = true;

        } else {
            
            this.validatingResources = true;
        }
        setTimeout(() => {
            this.validatingResources = false;
            this.successResources = false;
        }, 3000);
   
    };

    tryToPurchaseShip = (idx, amount) => {
        if(amount < 0){ amount = 0; }

        this.success = false;
        this.validating = false;
        this.validatingResources = false;
        this.successResources = false;
        
        const basePrice = ExchangeRate.resourcesToSpaceCredits(this.props.priceList[idx], ExchangeRate.NORMAL);

        var price = basePrice * amount;

        if(price > this.props.store.spaceCredits){
            
            this.validating = true;
            
        } else {
            this.props.store.changeShipAmount(idx, this.props.store.ships[idx]+amount);
            this.props.store.spaceCredits -= price;
            
            this.success = true;
        
        }
        setTimeout(() => {
            this.validating = false;
            this.success = false;
        }, 3000);
        
    };

}

export default ShipyardComponent;
