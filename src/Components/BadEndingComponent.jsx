import React, { Component } from 'react';
import { observer } from 'mobx-react';

import GameState from '../Libs/BonVoyage/Model/GameState';

@observer
class BadEndingComponent extends Component {
    render () {
        return (
            <div className={ this.props.visibility ? '' : 'hidden' }>
                <h3>{this.props.store.gameOverScreen.title}</h3>
                <p>{this.props.store.gameOverScreen.description}</p>
                <div className="clear"></div>
                <div className="text-center">
                    <button onClick={(e) => this.returnToHome(e)} className="action-red">» PLAY AGAIN?</button>
                </div>
            </div>
        );
    }

    returnToHome(){
        this.props.store.changeState(GameState.states.home)
    }
}
export default BadEndingComponent;