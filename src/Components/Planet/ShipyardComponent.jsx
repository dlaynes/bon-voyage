import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { observable } from 'mobx';

import ShipyardItemComponent from './Shipyard/ShipyardItemComponent';

@observer
class ShipyardComponent extends Component {

    timeout = null;
    timeoutResources = null;
    
    @observable success = false;
    @observable successResources = false;
    @observable validating = false;
    @observable validatingResources = false;

    render() {

        var validShipIds = this.props.store.validConstructibleShips;

        return (
            <div className={this.props.visibility?'':'hidden'}>
                <h4>Shipyard</h4>
                <p>Interested in anything?</p>
                <table className="tbl-ships tbl-ships-space">
                    <tbody>
                    <tr>
                        {validShipIds.map((x, i) =>
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
        if(amount < 0){ amount = 0; }
        let spaceBuy = true, originalAmount = this.props.store.ships[idx];
        var realAmount = this.props.store.tryUsingShipAmount(idx, amount, this.props.priceList[idx], spaceBuy);
        if(realAmount > originalAmount){
            this.successResources = true;
        } else {
            this.validatingResources = true;
        }
        if(!this.timeoutResources){
            this.timeoutResources = setTimeout(() => {
                this.validatingResources = false;
                this.successResources = false;
                this.timeoutResources = null;
            }, 3000);
        }
    };

    tryToPurchaseShip = (idx, amount) => {
        if(amount < 0){ amount = 0; }

        var techData = this.props.priceList[idx],
            price = techData.sellingPrice * amount;

        if(price > this.props.store.spaceCredits){
            this.validating = true;
        } else {
            this.props.store.changeShipAmount(idx, this.props.store.ships[idx]+amount);
            this.props.store.spaceCredits -= price;
            this.success = true;
        }
        if(!this.timeout){
            this.timeout = setTimeout(() => {
                this.validating = false;
                this.success = false;
                this.timeout = null;
            }, 3000);
        }
    };

}

export default ShipyardComponent;
