import { observable, computed, action } from 'mobx';

import GameLoop from "../Libs/GameLoop";

import GameEvent from '../Libs/BonVoyage/Model/GameEvent';
import GameState from '../Libs/BonVoyage/Model/GameState';

import Space from '../Libs/BonVoyage/Model/Space';
import PlayerFleet from '../Libs/BonVoyage/Model/Fleet/PlayerFleet';
import Fleet from '../Libs/BonVoyage/Model/Fleet';
import HeadQuarters from '../Libs/BonVoyage/Model/HeadQuarters';
import LandMark from '../Libs/BonVoyage/Model/LandMark';
import Planet from '../Libs/BonVoyage/Model/Planet';
import BattleManager from '../Libs/BonVoyage/BattleManager';

class AppStore {

    state = new GameState();
    headQuarters = new HeadQuarters();
    playerFleet = new PlayerFleet();
    enemyFleet = new Fleet();
    currentPlanet = new Planet();
    
    landMarks = LandMark.defaultList.slice(0);
    gameLoop = new GameLoop();

    @observable debugMode = false;

    @observable pastEvents = [];
    @observable currentState = 1;
    @observable gameOverScreen = Object.assign({}, GameState.gameOverScreens['-1']);

    @observable currentEvent = new GameEvent(this);

    //commands = new CommandList();

    constructor() {
        this.battleManager = new BattleManager(this);
        this.battleManager.setAllyFleet(this.playerFleet);
        this.battleManager.setEnemyFleet(this.enemyFleet);

        this.gameLoop.setSpeed(Space.defaultIntervalSpeed);
        this.gameLoop.setHandler(this.handleGameLoop);
    }


    resetEventDescriptions(){
        this.currentEvent.set(GameEvent.defaultEvent);
        this.setGameOverStatus(GameState.gameOverScreens['-1'].title,GameState.gameOverScreens['-1'].description);
        this.currentPlanet.set(Planet.planets['default']);
    }

    @action setGameOverStatus(title,description){
        this.gameOverScreen.title = title;
        this.gameOverScreen.description = description;
    }

    @action resetPastEvents(){
        this.pastEvents = [];
    }

    resetLandMarks(){
        for(let i=0; i < this.landMarks.length; i++){
            this.landMarks[i].visited = false;
        }
    }
    
    randomEvent(){
        if(this.currentState==GameState.states.event){
            return;
        }
        const id = GameEvent.getRandomEventId(this);
        let state = this.currentEvent.init(id);
        this.changeState(state);
    }

    calcEventProbability(){
        /* TODO: make it easier for slow fleets */
        return GameEvent.EVENT_PROBABILITY;
    }

    showEnding(reason){
        switch(reason){
            case GameState.endings.success:
                this.changeState(GameState.states.goodEnding);
                break;
            case GameState.endings.quitGame:
                this.changeState(GameState.states.home);
                break;
            default:
                this.changeState(GameState.states.badEnding, reason);
                break;
        }
    }

    handleGameLoop = () => {
        //console.log("In loop. Distance", this.distance);
        const fleet = this.playerFleet;

        let step = Space.calcProgress(fleet.duration, Space.defaultDistance);

        if(fleet.distance < step){
            fleet.distance = 0;
            this.showEnding(GameState.endings.success);
            return;
        } else {
            fleet.distance -= step;
        }

        if(fleet.deuterium < fleet.consumption){
            this.showEnding(GameState.endings.noDeuterium);
            return;
        }
        fleet.deuterium -= fleet.consumption; //This triggers a capacity update, hopefully
        fleet.timeUnit += 1;

        /* remove slowdowns and speed-ups */
        if(fleet.speedEffectCounter){
            fleet.speedEffectCounter--;
            if(fleet.speedEffectCounter==0){
                fleet.fleetSpeed = 10;
                this.playerFleet.updateStats(window.bvConfig.shipData);
            }
        }

        do {
            for(let i=0; i < this.landMarks.length; i++){

                if(!this.landMarks[i].visited && this.playerFleet.distance < this.landMarks[i].distance){
                    this.landMarks[i].visited = true;
                    let result = this.landMarks[i].action(this);
                    if(result){
                        this.changeState(result.state, result.data);
                        return;
                    }
                    break;
                }
            }

            if(Math.random() < this.calcEventProbability()){
                this.randomEvent();
            }
        } while(false);
    };

    goToSpace(){
        var res = this.playerFleet.setResources({
            metal: this.headQuarters.metal,
            crystal: this.headQuarters.crystal,
            deuterium: this.headQuarters.deuterium
        });
        this.pastEvents.push({time:0, message:"Mission just started!","type":'info'});
        this.changeState(GameState.states.space);
    }

    changeState(state, data){
        switch(state){
            case GameState.states.home:
                break;
            case GameState.states.ships:
                this.playerFleet.reset();
                this.headQuarters.reset();
                this.gameLoop.reset();
                this.resetPastEvents();
                this.resetLandMarks();
                this.resetEventDescriptions();
                break;
            case GameState.states.space:
                this.playerFleet.resetShipChanges();
                this.enemyFleet.resetShipChanges();
                this.enemyFleet.resetShips();
                this.gameLoop.pause();
                setTimeout(() => {
                    this.gameLoop.play();
                }, 2000);
                break;
            case GameState.states.event:
                this.gameLoop.pause();
                //Do something with data
                break;
            /* case GameState.states.battle:
                this.gameLoop.pause();
                break; */
            case GameState.states.planet:
                this.gameLoop.pause();
                this.pastEvents.push({time: this.playerFleet.timeUnit,message:"We just reached planet "+data.name,type:'info'});
                this.currentPlanet.set(data);
                break;
            case GameState.states.badEnding:
                this.gameLoop.pause();
                this.setGameOverStatus(GameState.gameOverScreens[data].title, GameState.gameOverScreens[data].description);
                break;
            case GameState.states.goodEnding:
                this.gameLoop.pause();
                break;
            default:
                console.warn("Unknown state...", state);
                return;
                break;
        }

        this.currentState = state;
    }

}

export default AppStore;
