import React, { Component } from 'react';

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
                    <strong> Game speed: </strong>
                    <input onChange={this.setGameSpeed} className="input-mini"
                           defaultValue={this.props.store.intervalSpeed} />
                    <br />
                    <strong>Events enabled? </strong>
                    <input type="checkbox" onChange={this.toggleEvents} />
                    <strong> Space Credits </strong>
                    <input onChange={this.setSpaceCredits} defaultValue={this.props.store.spaceCredits} />
                </div>
            </div>
        )    
    }
    
    goToHome = () => {
        this.props.store.changeState(this.props.store.gameStates.home);
    };
    goToShipPage = () => {
        this.props.store.changeState(this.props.store.gameStates.ships);
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
        this.props.store.changeState(this.props.store.gameStates.ships);
        for(var idx in ships){
            if(!ships.hasOwnProperty(idx)) continue;
            this.props.store.tryUsingShipAmount(idx, ships[idx], window.bvConfig.shipData[idx]);
        }
        this.props.store.goToSpace();
    }

    toggleEvents = (event) => {
        let v = event.target.checked;
    };

    setSpaceCredits = (event) => {
        let v = event.target.value;
        this.props.store.spaceCredits = parseInt(v, 10);
    };

    setGameSpeed = (event) => {
        let v = event.target.value;
        this.props.store.intervalSpeed = parseInt(v, 10);
    };
    
}

export default DebugBar; 