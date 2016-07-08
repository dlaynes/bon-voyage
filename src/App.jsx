import React, { Component } from 'react';
import { observer } from 'mobx-react';
import DevTools from 'mobx-react-devtools';

import HomeComponent from './Components/HomeComponent';
import BadEndingComponent from './Components/BadEndingComponent';
import SelectShipsComponent from './Components/SelectShipsComponent';
import SpaceComponent from './Components/SpaceComponent';
import PlanetComponent from './Components/PlanetComponent';
import GoodEndingComponent from './Components/GoodEndingComponent';

import DebugBar from './Components/Debug/DebugBar';

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
                <HomeComponent visibility={visibility.home} store={store} />
                <SelectShipsComponent priceList={window.bvConfig.shipData}
                                      visibility={visibility.ships} store={store} />
                <SpaceComponent visibility={visibility.space} priceList={window.bvConfig.shipData} store={store} />
                <PlanetComponent priceList={window.bvConfig.shipData} store={store} visibility={visibility.planet} />
                <BadEndingComponent visibility={visibility.badEnding} store={store} />
                <GoodEndingComponent visibility={visibility.goodEnding} store={store} />
            </div>
            <DebugBar store={store} />

            <DevTools />
        </div>
        );
    }
}

export default App;
