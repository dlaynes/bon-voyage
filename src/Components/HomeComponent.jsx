import React, { Component } from 'react';
import { observer } from 'mobx-react';

import GameState from '../Libs/BonVoyage/Model/GameState';

@observer
class HomeComponent extends Component {
    render () {
        return (
            <div className={ this.props.visibility ? '' : 'hidden' }>
                <h3>Bon Voyage</h3>
                <p><span className="text-warning">The Sector is at war. Greed and corruption split the Confederation in half.<br />
                    Outlaws attack everybody on sight. For many of them there is a price on their heads.
                    <br />Two enemy civilizations, <span className="text-info">The Scourge</span> and <span className="text-info">Quadrant 12</span>
                    , threaten to destroy what is left of the old Government...</span></p>
                <br /><br />
                <p><span className="text-success">
                    Good morning Admiral. Your mission is to reach planet Omega, in order to deliver confidential documents to the Confederates.<br />
                    You are free to build your own ships. We really trust your instincts, so we will give you a part of our resources to do so.
                    </span>
                </p>
                <br />
                <p><span className="text-success">
                    There are two ally planets on the way.<br />
                    But you will need Credits in order to upgrade the fleet, and buy more fuel.<br /><br />Good luck.
                    </span>
                </p>
                <br />
                <div className="clear"></div>
                <div className="text-center">
                    <button onClick={(e) => this.goToShipSelection(e)}
                            className="action-red">» CREATE EXPEDITION FLEET</button>
                </div>

                <small className="pull-right"><br />Bon Voyage v.0.2</small>
            </div>
        );
    }

    goToShipSelection(){
        this.props.store.changeState(GameState.states.ships);
    }
}
export default HomeComponent;