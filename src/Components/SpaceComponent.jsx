import React, { Component } from 'react';

import MapComponent from './Space/MapComponent';
import EventListComponent from './Space/EventListComponent';
import ShipListComponent from './Utils/ShipListComponent';

class SpaceComponent extends Component {
    render () {
        return (
            <div className={ this.props.visibility ? '' : 'hidden' }>
                <h3>Space</h3>
                <p>[Random message]</p>
                <MapComponent store={this.props.store} />
                <EventListComponent store={this.props.store} />
                <div className="clear"></div>
                <ShipListComponent store={this.props.store} priceList={this.props.priceList} />
            </div>
        );
    }

    returnToHome(){
        this.props.store.changeState(this.props.store.gameState.home)
    }
}
export default SpaceComponent;