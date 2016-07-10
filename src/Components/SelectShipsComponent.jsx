import React, { Component } from 'react';
import { observable, action, computed } from 'mobx';
import { observer } from 'mobx-react';

import ResourceListComponent from "./Ships/ResourceListComponent";
import SelectorComponent from "./Ships/SelectorComponent";

@observer
class SelectShipsComponent extends Component {

    @observable validating = false;
    @observable validatingResources = false;

    @computed get watchOneShipErrorClass () {
        return (this.validating && !this.props.store.shipCount) ? 'text-error pull-left' : 'hidden';
    };
    @computed get watchNoDeuteriumClass () {
        return (this.validating && !this.props.headQuarters.baseDeuterium) ? 'text-error-pull-left':'hidden';
    };

    render () {

        return (
            <div className={ this.props.visibility ? '' : 'hidden' }>
                <h3>Build Fleet</h3>
                <p>Prepare yourself for the trip. Perhaps you want certain ships for your needs?<br />
                    We will give you the remaining resources (if you have enough room available). Watch out on the deuterium usage!</p>
                <div className="pull-right half">
                    <ResourceListComponent headQuarters={this.props.headQuarters}
                                           module="ships" store={this.props.store} />
                    <br />
                </div>
                <SelectorComponent tryToAlterShipCount={this.tryToAlterShipCount}
                                   priceList={this.props.priceList} store={this.props.store} />
                <div className="clear"></div>
                <div className="text-center">
                    <button onClick={this.resetShipStore} className="text-warning">» RESET</button>
                    <button onClick={this.goToSpace.bind(this)} className="action-red">» READY?</button>
                </div>
                <span className={this.validatingResources?'text-error':'hidden'}>Not enough Resources!</span>
                <span className={this.watchOneShipErrorClass}>We need at least one ship!</span>
                <span className={this.watchNoDeuteriumClass}>We can't go anywhere without deuterium!</span>
                <div className="clear"></div>
            </div>
        );
    }

    validate() {
        var c = this.props.store.shipCount;
        if(!c){
            return false;
        }
        return !! this.props.headQuarters.baseDeuterium;
    }

    tryToAlterShipCount = (idx,amount, increasing) => {
        if(amount < 0){ amount = 0; }
        let spaceBuy = false, originalAmount = this.props.store.ships[idx];
        let realAmount = this.props.store.tryUsingShipAmount(idx, amount, this.props.priceList[idx], spaceBuy);

        this.validating = false;
        
        if(realAmount > originalAmount || !increasing){

        } else {
            
            this.validatingResources = true;
             setTimeout(() => {
                this.validatingResources = false;
            }, 3000);
        }
    };

    resetShipStore = () => {
        this.props.store.resetFleet();
        this.props.headQuarters.resetBaseResources();
    };

    @action goToSpace(){

        this.validatingResources = false;
        this.validating = false;
        
        if(this.validate()){
            this.props.store.goToSpace();
            
        } else {
            this.validating = true;

            setTimeout(() => {
                this.validating = false;
            }, 3000);
        }
    };
}
export default SelectShipsComponent;