import React, { Component } from 'react';
import { observer } from 'mobx-react';

import GameState from '../Libs/BonVoyage/Model/GameState';

@observer
class HomeComponent extends Component {
    render () {
        return (
            <div className={ this.props.visibility ? '' : 'hidden' }>
                <h3>Welcome</h3>
                <p>Good morning Admiral.</p>
                <p>Blah blah blah lorem Ipsum</p>
                <div className="clear"></div>
                <div className="text-center">
                    <button onClick={(e) => this.goToShipSelection(e)}
                            className="action-red">» CREATE EXPEDITION FLEET</button>
                </div>
            </div>    
        );
    }

    goToShipSelection(){
        this.props.store.changeState(GameState.states.ships);
    }
}
export default HomeComponent;