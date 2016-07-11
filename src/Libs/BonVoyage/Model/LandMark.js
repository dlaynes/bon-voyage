import Fleet from './Fleet';
import GameState from './GameState';
import Planet from './Planet';

class LandMark {
    static defaultList = [
        {
            distance: 81000,
            visited: false,
            action: (store) => {
                let onlyProbes = true;
                for(let i=0; i < Fleet.validShips.length; i++){
                    let idx = Fleet.validShips[i];

                    if( idx != 210 && store.playerFleet.ships[idx]) {
                        onlyProbes = false;
                        break;
                    }
                }
                if(onlyProbes){
                    return {state: GameState.states.badEnding, data: GameState.endings.missingProbes};
                }
                return null;
            }
        },
        {
            distance: 80500,
            visited: false,
            action: (store) => {
                return {state: GameState.states.planet, data: Planet.planets["v-3455"]};
            }
        },
        {
            distance: 38500,
            visited: false,
            action: () => {
                return {state: GameState.states.planet, data: Planet.planets["tau-wg"]};
            }
        },
        {
            distance: 3500,
            visited: false,
            action: (store) => {
                let onlyProbes = true;
                for(let i=0; i < Fleet.validShips.length; i++){
                    let idx = Fleet.validShips[i];

                    if( idx != 210 && store.playerFleet.ships[idx]) {
                        onlyProbes = false;
                        break;
                    }
                }
                if(onlyProbes){
                    return {state: GameState.states.badEnding, data: GameState.endings.missingProbes};
                }
                return null;
            }
        }
    ];
}

export default LandMark;