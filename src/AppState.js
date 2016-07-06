import { observable } from 'mobx';

class AppState {
    @observable gameState = 1;

    gameStates = {
        home : 1,
        ships : 2,
        space: 3,
        event : 4,
        battleResult : 5,
        planet: 6,
        endBad: 7,
        endGood: 8
    };

    constructor() {

    }

    /* We trust you*/
    changeState(state){
        this.gameState = state;
    }
}

export default AppState;
