import React, { Component } from 'react';
import { computed } from 'mobx';
import { observer } from 'mobx-react';

import Space from '../../../Libs/BonVoyage/Model/Space';

@observer
class ShipComponent extends Component {

    @computed get calcMapDistance(){
        return this.props.mapWidth - ((this.props.fleet.distance * this.props.mapWidth) / Space.defaultDistance);
    }

    render(){
        const fleetStyle = {left: this.calcMapDistance + 2};
        let fleetClass = 'text-warning';
        if(this.props.fleet.fleetSpeed > 10){
            fleetClass = 'current_capacity';
        } else if (this.props.fleet.fleetSpeed < 10){
            fleetClass = 'slow_down';
        }
        return(
            <span id="fleet" className={fleetClass} style={fleetStyle}>{this.props.symbol}</span>
        );
    }
}


export default ShipComponent;