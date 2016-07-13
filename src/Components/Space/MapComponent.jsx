import React, { Component } from 'react';

import ShipComponent from './Map/ShipComponent';

class MapComponent extends Component {
    
    mapWidth = 520;
    
    render(){
        return(
            <div className="space-map-container">
            <pre className="space-map">+                            +<br />
<span />    +             +               +<br />
<span />        +          +<br />
<span />               <span className="text-info">Ů</span>              <span className="text-info">Φ</span>       <span className="text-success">Ω</span><br />
+<br />
<span />    +<br />
<span />        +              +            </pre>
                <ShipComponent mapWidth={this.mapWidth} fleet={this.props.store.playerFleet} symbol="Э" />
                </div>
        )

    }
}

export default MapComponent;