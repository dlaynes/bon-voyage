import React, { Component } from 'react';
import { observer } from 'mobx-react';

@observer
class MapComponent extends Component {

    render(){
        var fleetStyle = {left: this.props.store.calcMapDistance};

        return(
            <div className="pull-left">
                <pre className="space-map">
+                            +
    +             +               +
        +          +
<span className="text-warning" style={fleetStyle}>Э</span>             <span className="text-info">o</span>            <span className="text-info">o</span>           <span className="text-success">Ω</span>
+
    +
        +              +
                </pre>
            </div>
        )

    }
}

export default MapComponent;