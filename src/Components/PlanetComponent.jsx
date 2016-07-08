import React, { Component } from 'react';
import { observer } from 'mobx-react';

@observer
class PlanetComponent extends Component {
    render () {
        return (
            <div className={ this.props.visibility ? '' : 'hidden' }>
                <h3>Planet: {this.props.store.currentPlanet.name}</h3>
                <p>{this.props.store.currentPlanet.description}</p>
                
            </div>
        );
    }

}
export default PlanetComponent;