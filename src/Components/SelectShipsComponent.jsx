import React, { Component } from 'react';
import { observable, action, computed } from 'mobx';
import { observer } from 'mobx-react';

import ResourceListComponent from "./Ships/ResourceListComponent";
import SelectorComponent from "./Ships/SelectorComponent";

@observer
class SelectShipsComponent extends Component {

    @observable validating = false;

    @computed get watchOneShipErrorClass () {
        return (this.validating && !this.props.store.shipCount) ? 'text-error pull-left' : 'hidden';
    };
    @computed get watchNoDeuteriumClass () {
        return (this.validating && !this.props.store.baseDeuterium) ? 'text-error-pull-left':'hidden';
    };

    timeout = null;

    render () {

        return (
            <div className={ this.props.visibility ? '' : 'hidden' }>
                <h3>Build Fleet</h3>
                <p>Prepare yourself for the trip. Perhaps you want certain ships for your needs?<br />
                    We will give you the remaining resources (if you have enough room available). Watch out on the deuterium usage!</p>
                <div className="pull-right half">
                    <ResourceListComponent module="ships" store={this.props.store} />
                </div>
                <SelectorComponent priceList={this.props.priceList} store={this.props.store} />
                <div className="clear"></div>
                <div className="text-center">
                    <button onClick={this.resetShipStore} className="text-warning">» RESET</button>
                    <button onClick={this.goToSpace.bind(this)} className="action-red">» READY?</button>
                </div>
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
        return !! this.props.store.baseDeuterium;
    }

    resetShipStore = () => {
        this.props.store.resetFleet();
        this.props.store.resetBaseResources();
    };

    @action goToSpace(){
        if(this.validate()){
            this.props.store.goToSpace();
            
            this.validating = false;
        } else {
            this.validating = true;

            if(!this.timeout){
                this.timeout = setTimeout(() => {
                    this.validating = false;
                    this.timeout = null;
                }, 3000);
            }
        }
    };
}
export default SelectShipsComponent;