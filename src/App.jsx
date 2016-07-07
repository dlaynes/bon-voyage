import React, { Component } from 'react';
import { observer } from 'mobx-react';
import DevTools from 'mobx-react-devtools';

import HomeComponent from './Components/HomeComponent';
import BadEndingComponent from './Components/BadEndingComponent';
import SelectShipsComponent from './Components/SelectShipsComponent';
import SpaceComponent from './Components/SpaceComponent';
import PlanetComponent from './Components/PlanetComponent';
import GoodEndingComponent from './Components/GoodEndingComponent';

@observer
class App extends Component {

    render() {
        let store = this.props.appStore;

        let visibility = {
            home: (store.gameState==store.gameStates.home),
            ships: (store.gameState==store.gameStates.ships),
            space: (store.gameState==store.gameStates.space),
            planet: (store.gameState==store.gameStates.planet),
            badEnding: (store.gameState==store.gameStates.endBad),
            goodEnding: (store.gameState==store.gameStates.endGood)
        };
        return (
        <div>
            <div id="holder">
                <HomeComponent visibility={visibility.home} setGameState={this.setGameState} store={store} />
                <SelectShipsComponent priceList={window.bvConfig.shipData}
                                      visibility={visibility.ships} setGameState={this.setGameState} store={store} />
                <SpaceComponent visibility={visibility.space} priceList={window.bvConfig.shipData}
                                setGameState={this.setGameState} store={store} />
                <PlanetComponent priceList={window.bvConfig.shipData} visibility={visibility.planet}
                                 setGameState={this.setGameState} />
                <BadEndingComponent visibility={visibility.badEnding} setGameState={this.setGameState} store={store} />
                <GoodEndingComponent visibility={visibility.goodEnding}
                                     setGameState={this.setGameState} store={store} />
            </div>
            <DevTools />
        </div>
        );
    }

    /* fat arrow function ('this' will always be available) */
    setGameState = (idx) => {
        this.props.appStore.changeState(idx);
    };
}

export default App;
