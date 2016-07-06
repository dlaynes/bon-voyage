import React, { Component } from 'react';

class SpaceComponent extends Component {
    render () {
        return (
            <div className={ this.props.visibility ? '' : 'hidden' }>
                <h3>Space Page Title</h3>
                <p>Space page message</p>
                <div className="clear"></div>
                <div className="text-center">
                    <button onClick={(e) => this.returnToHome(e)} className="action-red">» PLAY AGAIN?</button>
                </div>
            </div>
        );
    }

    returnToHome(){
        this.props.store.changeState(this.props.store.gameState.home)
    }
}
export default SpaceComponent;