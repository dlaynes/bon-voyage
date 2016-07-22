import React, { Component } from 'react';

import ShipComponent from './Map/ShipComponent';
import PlanetComponent from './Map/PlanetComponent';

class MapComponent extends Component {
    
    mapWidth = 521;

    render(){

        let planets = [];
        for(let planet of this.props.store.planets){
            planets.push( <PlanetComponent mapWidth={this.mapWidth} distance={planet.distance} planet={planet.planet} /> );
        }

        return(
            <div className="space-map-container">
            <pre className="space-map">+                            +<br />
<span />    +             +               +<br />
<span />        +          +<br />
<span /><ShipComponent mapWidth={this.mapWidth} fleet={this.props.store.playerFleet} symbol="Э" />{planets}                                     <br />
+<br />
<span />    +<br />
<span />        +              +            </pre>

                </div>
        )

    }
}

export default MapComponent;