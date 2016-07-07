import React, { Component } from 'react';

class PlanetComponent extends Component {
    render () {
        return (
            <div className={ this.props.visibility ? '' : 'hidden' }>
                <h3>Planet</h3>
                <p>Message</p>
                
                
            </div>
        );
    }

    returnToHome(){
        this.props.store.changeState(this.props.store.gameState.home)
    }
}
export default PlanetComponent;