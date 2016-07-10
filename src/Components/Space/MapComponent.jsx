import React, { Component } from 'react';
import { computed } from 'mobx';
import { observer } from 'mobx-react';

import Space from '../../Libs/BonVoyage/Model/Space';

@observer
class MapComponent extends Component {
    
    mapWidth = 520;

    @computed get calcMapDistance(){
        return this.mapWidth - ((this.props.store.playerFleet.distance * this.mapWidth) / Space.defaultDistance);
    }

    render(){
        var fleetStyle = {left: this.calcMapDistance + 2};

        return(
            <div className="space-map-container">
            <pre className="space-map">+                            +<br />
<span />    +             +               +<br />
<span />        +          +<br />
<span />             <span className="text-info">o</span>            <span className="text-info">o</span>           <span className="text-success">Ω</span><br />
+<br />
<span />    +<br />
<span />        +              +            </pre>
                <span id="fleet" className="text-warning" style={fleetStyle}>Э</span>
                </div>
        )

    }
}

export default MapComponent;