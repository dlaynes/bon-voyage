import React, { Component } from 'react';

import GameState from '../../Libs/BonVoyage/Model/GameState';
import Space from '../../Libs/BonVoyage/Model/Space';

class DebugBar extends Component {

    shipsLight = {
        '202' : 80,
        '204' : 800,
        '205' : 70,
        '210' : 340
    };

    shipsHeavy = {
        '203' : 10,
        '207' : 47,
        '213' : 7,
        '215' : 12
    };
    
    shipsExpedition = {
        '202' : 20,
        '203' : 4,
        '204' : 230,
        '205' : 40,
        '206' : 20,
        '207' : 18,
        '208' : 1,
        '209' : 2,
        '210' : 8,
        '211' : 2,
        '213' : 6,
        '215' : 8
    };
    
    render(){
        return (
            <div className="alert">
                <div className="text-center">
                    <button onClick={this.goToHome}>Home</button>
                    <button onClick={this.goToShipPage}>Ships</button>
                    <button onClick={this.selectSecretShips}>Ships (expedition)</button>
                    <button onClick={this.selectLightShips}>Ships (light)</button>
                    <button onClick={this.selectHeavyShips}>Ships (heavy)</button>
                    <button onClick={this.planetOne}>Planet 1 Exp</button>
                    <button onClick={this.planetTwo}>Planet 2 Exp</button>
                    <strong> Game speed: </strong>
                    <input onChange={this.setGameSpeed} className="input-mini"
                           defaultValue={Space.defaultIntervalSpeed} />
                    <br />
                    <strong>Events enabled? </strong>
                    <input type="checkbox" onChange={this.toggleEvents} />
                    <strong> Space Credits </strong>
                    <input onChange={this.setSpaceCredits} defaultValue={this.props.store.playerFleet.spaceCredits} />
                </div>
            </div>
        )    
    }
    
    goToHome = () => {
        this.props.store.changeState(GameState.states.home);
    };
    goToShipPage = () => {
        this.props.store.changeState(GameState.states.ships);
    };
    selectSecretShips = () => {
        this.chooseShips(this.shipsExpedition);
    };    
    selectLightShips = ( ) => {
        this.chooseShips(this.shipsLight);
    };    
    selectHeavyShips = () => {
        this.chooseShips(this.shipsHeavy);
    };
    chooseShips(ships){
        this.props.store.changeState(GameState.states.ships);
        for(var idx in ships){
            if(!ships.hasOwnProperty(idx)) continue;
            this.props.store.playerFleet.tryChangingShipAmount(idx, ships[idx],
                window.bvConfig.shipData[idx], this.props.store.headQuarters);
        }
        this.props.store.goToSpace();
    }
    planetOne = () => {
        this.chooseShips(this.shipsExpedition);
        this.props.store.playerFleet.distance = 81000;
    };
    planetTwo = () => {
        this.chooseShips(this.shipsExpedition);
        this.props.store.playerFleet.techs['124'] = 6;
        this.props.store.playerFleet.distance = 38000;
    };
    toggleEvents = (event) => {
        let v = event.target.checked;
    };

    setSpaceCredits = (event) => {
        let v = event.target.value;
        this.props.store.playerFleet.spaceCredits = parseInt(v, 10);
    };

    setGameSpeed = (event) => {
        let v = parseInt(event.target.value, 10);
        this.props.store.gameLoop.setSpeed(v);
    };
    
}

export default DebugBar; 