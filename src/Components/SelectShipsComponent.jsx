import React, { Component } from 'react';

import ResourceListComponent from "./Utils/ResourceListComponent";
import SelectorComponent from "./Utils/SelectorComponent";

class SelectShipsComponent extends Component {

    render () {

        return (
            <div className={ this.props.visibility ? '' : 'hidden' }>
                <h3>Build Fleet</h3>
                <p>Prepare yourself for the trip. Perhaps you want certain ships for your needs?<br />
                    We will give you the remaining resources (if you have enough room available). Watch out on the deuterium usage!</p>
                <div className="pull-right half">
                    <ResourceListComponent store={this.props.store} />
                </div>
                <SelectorComponent priceList={this.props.priceList} store={this.props.store} />
                <div className="clear"></div>

                <div className="text-center">
                    <button onClick={this.resetShipStore} className="text-warning">» RESET</button>
                    <button onClick={this.startBattle} className="action-red">» READY?</button>
                </div>
            </div>
        );
    }

    validate() {
        return true;
    }

    resetShipStore = () => {
        this.props.store.resetShipSelection();
    };

    startBattle = () => {
        if(this.validate()){
            this.props.store.changeState(this.props.store.gameState.space);
        }
    };
}
export default SelectShipsComponent;