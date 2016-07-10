import { observable, computed, action } from 'mobx';

import GameLoop from "../Libs/GameLoop";
import FixedQueue from "../Libs/FixedQueue";

import GameEvent from '../Libs/BonVoyage/Model/GameEvent';
import GameState from '../Libs/BonVoyage/Model/GameState';

import Space from '../Libs/BonVoyage/Model/Space';
import PlayerFleet from '../Libs/BonVoyage/Model/Fleet/PlayerFleet';
import Fleet from '../Libs/BonVoyage/Model/Fleet';
import HeadQuarters from '../Libs/BonVoyage/Model/HeadQuarters';
import LandMark from '../Libs/BonVoyage/Model/LandMark';

class AppStore {
    @observable gameState = 1;

    EVENT_PROBABILITY = 0.15;

    state = new GameState();
    headQuarters = new HeadQuarters();
    playerFleet = new PlayerFleet();
    enemyFleet = new Fleet();

    /* Ship variables */

    @observable enemyShips = {
        '202':0,
        '203':0,
        '204':0,
        '205':0,
        '206':0,
        '207':0,
        '208':0,
        '209':0,
        '210':0,
        '211':0,
        '213':0,
        '214':0, //Death star
        '215':0  //Battle cruiser
    };

    @observable ships = {
        '202':0,
        '203':0,
        '204':0,
        '205':0,
        '206':0,
        '207':0,
        '208':0,
        '209':0,
        '210':0,
        '211':0,
        '213':0,
        '214':0,
        '215':0
    };
    @observable techs = {
        '109' : PlayerFleet.defaultTechs['109'],
        '110' : PlayerFleet.defaultTechs['110'],
        '111' : PlayerFleet.defaultTechs['111'],
        '115' : PlayerFleet.defaultTechs['115'],
        '117' : PlayerFleet.defaultTechs['117'],
        '118' : PlayerFleet.defaultTechs['118'],
        '124' : PlayerFleet.defaultTechs['124']
    };

    @observable enemyTechs = {
        '109' : 0,
        '110' : 0,
        '111' : 0,
        '115' : 0,
        '117' : 0,
        '118' : 0,
        '124' : 0
    };

    @observable distance = 0;
    @observable metal = 0;
    @observable crystal = 0;
    @observable deuterium = 0;
    @observable consumption = 0;
    @observable capacity = 0;
    @observable speed = 0;
    @observable spaceCredits = 0;
    @observable duration = 0;
    @observable fleetSpeed = 10;

    /* Space variables */

    @observable timeUnit = 0;

    @observable currentPlanet = {
        name: 'No Name',
        description: 'Unknown planet',
        actionStatus: 0
    };
    
    @observable pastEvents = FixedQueue(20, []);
    
    landMarks = LandMark.defaultList.slice(0);

    gameLoop = new GameLoop();

    @observable currentState = 1;

    @observable gameOverScreen = Object.assign({}, GameState.gameOverScreens['-1']);

    constructor() {
        this.enemyFleet.resetShips();
        this.playerFleet.reset();
    }

    @observable currentEvent = Object.assign({}, GameEvent.defaultEvent);

    resetEventDescriptions(){

        this.setCurrentEvent(Object.assign({}, GameEvent.defaultEvent));

        this.setGameOverStatus(GameState.gameOverScreens['-1'].title,GameState.gameOverScreens['-1'].description);

        this.setCurrentPlanet({
            title: 'No Name',
            description: 'Unknown Planet',
            actionStatus: 0
        });
    }

    @action setCurrentEvent(event){
        this.currentEvent.title = event.title;
        this.currentEvent.description = event.description;
        this.currentEvent.actions = event.actions;
    }

    @action setCurrentPlanet(planet){
        this.currentPlanet.name = planet.name;
        this.currentPlanet.description = planet.description;
        this.currentPlanet.actionStatus = planet.actionStatus;
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
        
    }

    calcEventProbability(){
        return this.EVENT_PROBABILITY;
    }

    showEnding(reason){
        switch(reason){
            case GameState.endings.success:
                this.changeState(GameState.states.endGood);
                break;
            case GameState.endings.quitGame:
                this.changeState(GameState.states.home);
                break;
            default:
                this.changeState(GameState.states.endBad, reason);
                break;
        }
    }    

    handleGameLoop = () => {
        //console.log("In loop. Distance", this.distance);

        let step = Space.calcProgress(this.duration, Space.defaultDistance);

        if(this.distance < step){
            this.distance = 0;
            this.showEnding(GameState.endings.success);
            return;
        } else {
            this.distance -= step;
        }

        if(this.deuterium < this.consumption){
            this.showEnding(GameState.endings.noDeuterium);
            return;
        }
        this.deuterium -= this.consumption; //This triggers a capacity update, hopefully
        this.timeUnit += 1;

        do {
            for(let i=0; i < this.landMarks.length; i++){

                if(!this.landMarks[i].visited && this.distance < this.landMarks[i].distance){
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
        var res = this.setResources({
            metal: this.headQuarters.baseMetal,
            crystal: this.headQuarters.baseCrystal,
            deuterium: this.headQuarters.baseDeuterium
        });
        this.pastEvents.push({time:0, message:"Mission just started!"});
        this.changeState(GameState.states.space);
    }

    changeState(state, data){
        switch(state){
            case GameState.states.home:
                break;
            case GameState.states.ships:
                this.resetFleet();
                this.headQuarters.resetBaseResources();
                this.gameLoop.reset();
                this.gameLoop.setSpeed(Space.defaultIntervalSpeed);
                this.gameLoop.setHandler(this.handleGameLoop);
                this.resetLandMarks();
                this.resetEnemyFleet();
                this.resetPastEvents();
                this.resetEventDescriptions();
                break;
            case GameState.states.space:
                setTimeout(() => {
                    this.gameLoop.play();
                }, 1000);
                break;
            case GameState.states.event:
                this.gameLoop.pause();
                //Do something with data
                break;
            case GameState.states.battle:
                this.gameLoop.pause();
                //Do something with data
                break;
            case GameState.states.planet:
                this.gameLoop.pause();
                this.pastEvents.push({time: this.timeUnit,message:"We just reached planet "+data.name});
                this.setCurrentPlanet(data);
                break;
            case GameState.states.endBad:
                this.gameLoop.pause();
                this.setGameOverStatus(GameState.gameOverScreens[data].title, GameState.gameOverScreens[data].description);
                break;
            case GameState.states.endGood:
                this.gameLoop.pause();
                break;
            default:
                console.warn("Unknown state...", state);
                return;
                break;
        }

        this.currentState = state;
    }

    /*  Fleet functions */

    @computed get shipCount(){
        let c = 0;
        for(var i=0; i < Fleet.validShips.length;i++){
            c += this.ships[Fleet.validShips[i]];
        }
        return c;
    }

    @computed get usedCapacity(){
        return this.metal + this.crystal + this.deuterium;
    }

    @action resetEnemyFleet(){
        for(let i=0; i < Fleet.validShips.length;i++) {
            let idx = Fleet.validShips[i];
            this.enemyShips[idx] = 0;
        }
        for(let i=0; i < Fleet.validMotors.length;i++) {
            let idx = Fleet.validMotors[i];
            this.enemyTechs[idx] = 0;
        }

        for(let i=0; i < Fleet.validBattleTechs.length;i++) {
            let idx = Fleet.validBattleTechs[i];
            this.enemyTechs[idx] = 0;
        }
    }

    @action resetFleet() {
        for(let i=0; i < Fleet.validShips.length;i++) {
            let idx = Fleet.validShips[i];
            this.changeShipAmount(idx, 0);
        }

        for(let i=0; i < Fleet.validMotors.length;i++) {
            let idx = Fleet.validMotors[i];
            this.techs[idx] = PlayerFleet.defaultTechs[idx];
        }
        for(let i=0; i < Fleet.validBattleTechs.length;i++) {
            let idx = Fleet.validBattleTechs[i];
            this.techs[idx] = PlayerFleet.defaultTechs[idx];
        }

        this.metal = 0;
        this.crystal = 0;
        this.deuterium = 0;
        this.spaceCredits = 0;

        this.duration = 0;
        this.speed = 0;
        this.distance = Space.defaultDistance;
        this.consumption = 0;
        this.capacity = 0;
        
        this.timeUnit = 0;
    }

    @action setResources(resources){
        var actualResources = {metal: 0, crystal: 0, deuterium: 0};
        var remaining = this.capacity;

        if(remaining > resources.deuterium){
            remaining -= resources.deuterium;
            actualResources.deuterium = resources.deuterium;

            if(remaining > resources.metal){
                remaining -= resources.metal;
                actualResources.metal = resources.metal;

                if(remaining > resources.crystal){
                    //We don't have to substract anymore
                    actualResources.crystal = resources.crystal;
                } else {
                    actualResources.crystal = remaining;
                }
            } else {
                actualResources.metal = remaining;
            }
        } else {
            actualResources.deuterium = remaining;
        }
        this.metal = actualResources.metal;
        this.crystal = actualResources.crystal;
        this.deuterium = actualResources.deuterium;

        return actualResources;
    }

    @action changeShipAmount(idx, num){
        if(idx in this.ships){
            this.ships[idx] = num;
        }

        let slowest = 9999999999,
            consumption = 0,
            speed = 0,
            capacity = 0,
            minDistance = Space.minDistance,
            combustionDriveTech = this.techs['115'],
            impulseDriveTech = this.techs['117'],
            hyperspaceDriveTech = this.techs['118'],
            shipListExtra = {},
            distance = minDistance;


        for(let i=0; i < Fleet.validShips.length;i++){

            let idx = Fleet.validShips[i];
            if(!this.ships[idx]){
                continue;
            }

            let new_speed = null,
                new_consumption = null,
                priceList = window.bvConfig.shipData[idx],
                motor3 = priceList['motor3'],
                motor2 = priceList['motor2'];

            if(typeof motor3 !== undefined){
                for(let motor in motor3) {
                    if (!motor3.hasOwnProperty(motor)) continue;
                    switch(motor){
                        case '115':
                            if(combustionDriveTech > motor3[motor]){
                                new_speed = AppStore.calcSpeed(combustionDriveTech, priceList['speed3'], 1);
                                new_consumption = priceList.consumption3;
                            }
                            break;
                        case '117':
                            if(impulseDriveTech > motor3[motor]){
                                new_speed = AppStore.calcSpeed(impulseDriveTech, priceList['speed3'], 2);
                                new_consumption = priceList.consumption3;
                            }
                            break;
                        case '118':
                            if(hyperspaceDriveTech > motor3[motor]){
                                new_speed = AppStore.calcSpeed(hyperspaceDriveTech, priceList['speed3'], 3);
                                new_consumption = priceList.consumption3;
                            }
                            break;
                        default:
                            break;
                    }
                }
            }
            if(typeof motor2 !== undefined && !new_speed){
                for(let motor in motor2){
                    if (!motor2.hasOwnProperty(motor)) continue;
                    switch(motor){
                        case '115':
                            if(combustionDriveTech > motor2[motor]){
                                new_speed = AppStore.calcSpeed(combustionDriveTech, priceList['speed2'], 1);
                                new_consumption = priceList.consumption2;
                            }
                            break;
                        case '117':
                            if(impulseDriveTech > motor2[motor]){
                                new_speed = AppStore.calcSpeed(impulseDriveTech, priceList['speed2'], 2);
                                new_consumption = priceList.consumption2;
                            }
                            break;
                        case '118':
                            if(hyperspaceDriveTech > motor2[motor]){
                                new_speed = AppStore.calcSpeed(hyperspaceDriveTech, priceList['speed2'], 3);
                                new_consumption = priceList.consumption2;
                            }
                            break;
                        default:
                            break;
                    }
                }
            }
            if(!new_speed){
                switch(priceList['motor']){
                    case 115:
                        new_speed = AppStore.calcSpeed(combustionDriveTech, priceList['speed'], 1);
                        new_consumption = priceList.consumption;
                        break;
                    case 117:
                        new_speed = AppStore.calcSpeed(impulseDriveTech, priceList['speed'], 2);
                        new_consumption = priceList.consumption;
                        break;
                    case 118:
                        new_speed = AppStore.calcSpeed(hyperspaceDriveTech, priceList['speed'], 3);
                        new_consumption = priceList.consumption;
                        break;
                    default:
                        break;
                }
            }

            capacity += this.ships[idx] * priceList.capacity;
            slowest = Math.min(new_speed, slowest);
            shipListExtra[idx] = {speed: new_speed, consumption: new_consumption};

        }

        this.capacity = capacity;

        let duration = 10 + 35000/this.fleetSpeed * Math.sqrt((10*distance) / slowest ),

            sum = 0;

        for(let i=0; i < Fleet.validShips.length;i++) {
            let idx = Fleet.validShips[i];
            if (this.ships[idx]) {
                sum += this.ships[idx];
                consumption += AppStore.calcConsumption(distance, duration,
                    shipListExtra[idx].speed, this.ships[idx], shipListExtra[idx].consumption)  ;
                //console.log("consumption", consumption);
            }
        }

        if(sum){
            this.speed = slowest;
            this.duration = duration;
            this.consumption = consumption;
        } else {
            this.speed = 0;
            this.duration = 0;
            this.consumption = 0;
        }
    }

    static calcSpeed(motorLevel, speed, factor){
        return speed * (1 + motorLevel*factor/10 );
    }

    static calcConsumption(distance, duration, speed, amount, consumption){
        var av = (35000 / (duration - 10) ) * Math.sqrt(distance * 10 / speed);
        return Math.round( ((amount * consumption * distance )/35000 * Math.pow(av/ 10 + 1, 2 )));
    }


    /* Ship selection functions */

    @action tryUsingShipAmount(idx, amount, priceList, space){

        if(amount > Fleet.unitLimit){
            amount = Fleet.unitLimit;
        }
        if(!(idx in this.ships)){
            return;
        }
        let metal, crystal, deuterium;

        if(!space){
            metal = this.headQuarters.baseMetal;
            crystal = this.headQuarters.baseCrystal;
            deuterium = this.headQuarters.baseDeuterium;
        } else {
            metal = this.metal;
            crystal = this.crystal;
            deuterium = this.deuterium;
        }

        if(this.ships[idx]==amount){
            return;
        } else if(this.ships[idx] > amount){
            let dif = this.ships[idx] - amount;
            metal += (dif * priceList.metal);
            crystal += (dif * priceList.crystal);
            deuterium += (dif * priceList.deuterium);

            this.changeShipAmount(idx, amount);
        } else {
            let dif = amount - this.ships[idx];
            let originalMetalUsed = priceList.metal * this.ships[idx],
                originalCrystalUsed = priceList.crystal * this.ships[idx],
                originalDeuteriumUsed = priceList.deuterium * this.ships[idx],
                extraMetal,
                extraCrystal,
                extraDeuterium;

            //Loop until we are allowed to build more ships of this type
            while(dif){
                extraMetal = amount * priceList.metal;
                extraCrystal = amount * priceList.crystal;
                extraDeuterium = amount * priceList.deuterium;

                if(
                    metal + originalMetalUsed >= extraMetal &&
                    crystal + originalCrystalUsed >= extraCrystal &&
                    deuterium + originalDeuteriumUsed >= extraDeuterium
                ) {
                    break;
                }

                dif--;
                amount = this.ships[idx] + dif;
            }

            metal -= (dif * priceList.metal);
            crystal -= (dif * priceList.crystal);
            deuterium -= (dif * priceList.deuterium);

            this.changeShipAmount(idx, amount);
        }

        if(!space){
            this.headQuarters.baseMetal = metal;
            this.headQuarters.baseCrystal = crystal;
            this.headQuarters.baseDeuterium = deuterium;
        } else {
            this.metal = metal;
            this.crystal = crystal;
            this.deuterium = deuterium;
        }

        return amount;
    }

}

export default AppStore;
