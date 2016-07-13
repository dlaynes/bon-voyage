import React, { Component } from 'react';
import { observer } from 'mobx-react';

import ShipListComponent from './Utils/ShipListComponent';
import ResourceListComponent from './GoodEnding/ResourceListComponent';

import GameState from '../Libs/BonVoyage/Model/GameState';

@observer
class GoodEndingComponent extends Component {
    render () {
        return (
            <div className={ this.props.visibility ? '' : 'hidden' }>
                <h3>Good Ending Title</h3>
                <p>Good ending message</p>
                <div className="clear"></div>
                <div className="clear"></div>
                <div className="pull-left half">
                    <ShipListComponent module="goodEnding" fleet={this.props.store.playerFleet}
                                       store={this.props.store} priceList={this.props.priceList} />
                </div>
                <div className="pull-right half">
                    <ResourceListComponent module="goodEnding" store={this.props.store}
                                           playerFleet={this.props.store.playerFleet} />
                </div>
                <div className="clear"></div>
                <div className="text-center">
                    <br />
                    <button onClick={this.shareScore} className="text-success">» SHARE SCORE</button>
                    <br />
                    <br />
                    <button onClick={this.returnToHome} className="action-red">» PLAY AGAIN?</button>
                </div>
            </div>
        );
    }

    returnToHome = () => {
        this.props.store.changeState(GameState.states.home)
    };

    shareScore = () => {
          
    };
}
export default GoodEndingComponent;