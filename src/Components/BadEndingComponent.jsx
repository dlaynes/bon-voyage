import React, { Component } from 'react';
import { observer } from 'mobx-react';

@observer
class BadEndingComponent extends Component {
    render () {
        return (
            <div className={ this.props.visibility ? '' : 'hidden' }>
                <h3>{this.props.store.currentGameOverStatus.title}</h3>
                <p>{this.props.store.currentGameOverStatus.description}</p>
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
export default BadEndingComponent;