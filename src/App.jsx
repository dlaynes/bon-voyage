import React, { Component } from 'react';
import { observer } from 'mobx-react';
import DevTools from 'mobx-react-devtools';

import HomeComponent from './Components/HomeComponent';
import BadEndingComponent from './Components/BadEndingComponent';
import SelectShipsComponent from './Components/SelectShipsComponent';
import SpaceComponent from './Components/SpaceComponent';
import PlanetComponent from './Components/PlanetComponent';
import GoodEndingComponent from './Components/GoodEndingComponent';
import EventComponent from './Components/EventComponent';

import GameState from './Libs/BonVoyage/Model/GameState';

import DebugBar from './Components/Debug/DebugBar';

@observer
class App extends Component {

    render() {
        let store = this.props.appStore;

        let visibility = {
            home: (store.currentState==GameState.states.home),
            ships: (store.currentState==GameState.states.ships),
            space: (store.currentState==GameState.states.space),
            event: (store.currentState==GameState.states.event),
            planet: (store.currentState==GameState.states.planet),
            badEnding: (store.currentState==GameState.states.endBad),
            goodEnding: (store.currentState==GameState.states.endGood)
        };
        return (
        <div>
            <div id="holder">
                <HomeComponent visibility={visibility.home} store={store} />
                <SelectShipsComponent priceList={window.bvConfig.shipData} headQuarters={store.headQuarters}
                                      visibility={visibility.ships} store={store} />
                <SpaceComponent visibility={visibility.space} priceList={window.bvConfig.shipData} store={store} />
                <PlanetComponent priceList={window.bvConfig.shipData} store={store} visibility={visibility.planet} />
                <EventComponent visibility={visibility.event} priceList={window.bvConfig.shipData} store={store} />
                <BadEndingComponent visibility={visibility.badEnding} store={store} />
                <GoodEndingComponent visibility={visibility.goodEnding} priceList={window.bvConfig.shipData} store={store} />

            </div>
            <DebugBar store={store} state={store.state} />

            <DevTools />
        </div>
        );
    }
}

export default App;
