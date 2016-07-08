import React, { Component } from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';

import ShipyardComponent from './Planet/ShipyardComponent';
import SpacePortComponent from './Planet/SpacePortComponent';
import TraderComponent from './Planet/TraderComponent';
import MarketComponent from './Planet/MarketComponent';
import ResearchLabComponent from './Planet/ResearchLabComponent';

@observer
class PlanetComponent extends Component {

    render () {

        let visibility = {
            spacePort: (this.props.store.currentPlanet.actionStatus == 0),
            cityCentre : (this.props.store.currentPlanet.actionStatus == 1),
            shipYard : (this.props.store.currentPlanet.actionStatus == 2),
            market: (this.props.store.currentPlanet.actionStatus == 3),
            trader: (this.props.store.currentPlanet.actionStatus == 4),
            researchLab: (this.props.store.currentPlanet.actionStatus == 5)
        };

        return (
            <div className={ this.props.visibility ? '' : 'hidden' }>
                <h3>Planet: {this.props.store.currentPlanet.name}</h3>
                <p>{this.props.store.currentPlanet.description}</p>
                <table className="tbl-resources">
                    <thead>
                    <tr>
                        <th className="one-fifth">Metal</th>
                        <th className="one-fifth">Crystal</th>
                        <th className="one-fifth">Deuterium</th>
                        <th className="one-fifth">Space Credits</th>
                        <th>Capacity</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>{this.props.store.metal}</td>
                        <td>{this.props.store.crystal}</td>
                        <td>{this.props.store.deuterium}</td>
                        <td><span className="text-success">§ {this.props.store.spaceCredits}</span></td>
                        <td><span className="text-info">{this.props.store.usedCapacity}/{this.props.store.capacity}</span></td>
                    </tr>
                    </tbody>
                </table>
                <div>
                    <SpacePortComponent store={this.props.store} visibility={visibility.spacePort} />
                    <TraderComponent store={this.props.store} visibility={visibility.trader} />
                    <MarketComponent store={this.props.store} priceList={this.props.priceList}
                                     visibility={visibility.market} />
                    <ResearchLabComponent store={this.props.store} priceList={this.props.priceList}
                                          visibility={visibility.researchLab} />
                    <ShipyardComponent store={this.props.store} priceList={this.props.priceList}
                                       visibility={visibility.shipYard} />
                </div>
                <div className="bottom-menu text-center">
                    <span>Go to:</span>
                    <button onClick={this.goToSpacePort} className="text-info">» SPACE PORT</button>
                    <button onClick={this.goToShipYard} className="text-info">» SHIPYARD</button>
                    <button onClick={this.goToMarket} className="text-info">» MARKET</button>
                    <button onClick={this.goToTrader} className="text-info">» TRADER</button>
                    <button onClick={this.goToResearchLab} className="text-info">» LAB</button>
                    <button onClick={this.leavePlanet} className="text-error">» LEAVE PLANET</button>
                </div>
            </div>
        );
    }

    goToSpacePort = () => {
        this.props.store.currentPlanet.actionStatus = 0;
    };
    goToShipYard = () => {
        this.props.store.currentPlanet.actionStatus = 2;
    };
    goToMarket = () => {
        this.props.store.currentPlanet.actionStatus = 3;
    };
    goToTrader = () => {
        this.props.store.currentPlanet.actionStatus = 4;
    };
    goToResearchLab = () => {
        this.props.store.currentPlanet.actionStatus = 5;
    };
    leavePlanet = () => {
        this.props.store.changeState(this.props.store.gameStates.space);
    }

}
export default PlanetComponent;