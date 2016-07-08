import React, { Component } from 'react';
import { observer } from 'mobx-react';

@observer
class GoodEndingComponent extends Component {
    render () {
        return (
            <div className={ this.props.visibility ? '' : 'hidden' }>
                <h3>Good Ending Title</h3>
                <p>Good ending message</p>
                <div className="clear"></div>
                <div className="text-center">
                    <button onClick={this.shareScore} className="text-success">» SHARE SCORE</button>
                    <br />
                    <button onClick={this.returnToHome} className="action-red">» PLAY AGAIN?</button>
                </div>
            </div>
        );
    }

    returnToHome = () => {
        this.props.store.changeState(this.props.store.gameStates.home)
    };

    shareScore = () => {
          
    };
}
export default GoodEndingComponent;