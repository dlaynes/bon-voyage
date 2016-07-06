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
      let store = this.props.appState;

      let visibility = {
          home: (store.gameState==store.gameStates.home),
          ships: (store.gameState==store.gameStates.ships),
          space: (store.gameState==store.gameStates.space),
          planet: (store.gameState==store.gameStates.planet),
          badEnding: (store.gameState==store.gameStates.endBad),
          goodEnding: (store.gameState==store.gameStates.endGood)
      };

      console.log(store.gameState);
      
    return (
      <div>
        <div id="holder">
            <HomeComponent visibility={visibility.home} setGameState={this.setGameState} store={store} />
            <SelectShipsComponent visibility={visibility.ships} setGameState={this.setGameState} store={store} />
            <SpaceComponent visibility={visibility.space} setGameState={this.setGameState} store={store} />
            <PlanetComponent visibility={visibility.planet} setGameState={this.setGameState} store={store} />
            <BadEndingComponent visibility={visibility.badEnding} setGameState={this.setGameState} store={store} />
            <GoodEndingComponent visibility={visibility.goodEnding} setGameState={this.setGameState} store={store} />
        </div>
        <DevTools />
      </div>
    );
  }

  setGameState = (idx) => {
       this.props.appState.changeState(idx);
  };
    /*
  onReset = () => {
    this.props.appState.resetTimer();
  } */
}

export default App;
