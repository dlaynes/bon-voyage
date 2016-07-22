import React, { Component } from 'react';
import { observer } from 'mobx-react';

import Space from '../../../Libs/BonVoyage/Model/Space';

@observer
class PlanetComponent extends Component {

    get calcMapDistance(){
        return this.props.mapWidth + 12 - ((this.props.distance * this.props.mapWidth) / Space.defaultDistance);
    }

    render(){
        const planetStyle = {left: this.calcMapDistance + 2};
        let planetClass = this.props.planet.className;
        return(
            <span className={'planet '+planetClass} style={planetStyle}>{this.props.planet.symbol}</span>
        );
    }
}


export default PlanetComponent;