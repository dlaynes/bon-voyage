import React, { Component } from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { axios } from 'axios';

import ShipListComponent from './Utils/ShipListComponent';
import ResourceListComponent from './GoodEnding/ResourceListComponent';
import TechsNavComponent from './Space/TechsNavComponent';

import GameState from '../Libs/BonVoyage/Model/GameState';

@observer
class GoodEndingComponent extends Component {

    @observable shareScoreButton = true;

    render () {
        return (
            <div className={ this.props.visibility ? '' : 'hidden' }>
                <h3>We reached Planet Omega</h3>
                <TechsNavComponent debugMode={this.props.store.debugMode} techList={this.props.store.playerFleet.techs} />
                <p><span className="text-warning">Congratulations!</span></p>
                <div className="clear"></div>
                <br />
                <p>The mission was accomplished!<br />Current Nintendo President is thinking about releasing a mobile game based on the journey</p>
                <div className="clear"></div>
                <span className="text-success">These are your final stats:</span>
                <br /><br />
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
                    {/* <br />
                    <button onClick={this.shareScore} className={this.shareScoreButton?'text-success':'hidden'}>» SHARE SCORE</button>
                    <br /> */}
                    <br />
                    <button onClick={this.returnToHome} className="action-red">» PLAY AGAIN?</button>
                </div>
            </div>
        );
    }

    returnToHome = () => {
        this.shareScoreButton = true;
        this.props.store.changeState(GameState.states.home)
    };

    shareScore = () => {
         let params = {
             score: this.props.store.score,
             ships: this.props.store.playerFleet.shipCount,
             timeUnit: this.props.store.playerFleet.timeUnit,
             spaceCredits: this.props.store.playerFleet.spaceCredits
         };

         /*
        axios({
            method: 'post',
            url: '/user/12345',
            data: {
                firstName: 'Fred',
                lastName: 'Flintstone'
            }
        });
        */
    };
}
export default GoodEndingComponent;