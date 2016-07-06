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
                    <ResourceListComponent />
                </div>
                <SelectorComponent priceList={this.props.priceList} />
                <div className="clear"></div>

                <div className="text-center">
                    <button onClick={(e) => this.startBattle(e)} className="action-red">» PLAY AGAIN?</button>
                </div>
            </div>
        );
    }

    validate() {
        return true;
    }

    startBattle(){
        if(this.validate()){
            this.props.store.changeState(this.props.store.gameState.space);
        }
    }
}
export default SelectShipsComponent;