import React, { Component } from 'react';

import MapComponent from './Space/MapComponent';
import EventListComponent from './Space/EventListComponent';
import ShipListComponent from './Utils/ShipListComponent';
import ResourceListComponent from './Space/ResourceListComponent';
import TechsNavComponent from './Space/TechsNavComponent';

class SpaceComponent extends Component {

    render () {
        return (
            <div className={ this.props.visibility ? '' : 'hidden' }>
                <h3>Space</h3>
                <TechsNavComponent store={this.props.store} />
                <p>[Random message]</p>
                <div className="pull-left">
                    <MapComponent store={this.props.store} />
                </div>
                <div className="pull-right">
                    <EventListComponent store={this.props.store} />
                </div>
                <div className="clear"></div>
                <div className="pull-left half">
                    <ShipListComponent module="space" shipList={this.props.store.ships} store={this.props.store} priceList={this.props.priceList} />
                </div>
                <div className="pull-right half">
                    <ResourceListComponent module="space" store={this.props.store} />
                </div>
            </div>
        );
    }

    /* TO DO: el usuario deberia ser redirigido a una ventana estilo evento */
    returnToHome(){
        this.props.store.showEnding(this.props.store.gameEndings.quitGame);
    }
}
export default SpaceComponent;