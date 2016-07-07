import { observable, computed, action } from 'mobx';

import GameLoop from "../Libs/GameLoop";
import FixedQueue from "../Libs/FixedQueue";

class AppStore {
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

    mapWidth = 520;

    @observable endingReason = 6;

    gameEndings = {
        success: 0,
        missingProbes: 1,
        noDeuterium: 2,
        noShips : 3,
        supernova : 4,
        blackHole : 5,
        quitGame: 6
    };

    EVENT_PROBABILITY = 0.15;

    intervalSpeed = 1000;
    gameLoop = new GameLoop();

    /* Ship variables */

    minDistance = 50;
    defaultDistance = 120000;
    defaultMetal = 3000000;
    defaultCrystal = 1700000;
    defaultDeuterium = 350000;
    defaultMilitaryTech = 10;
    defaultArmorTech = 10;
    defaultShieldingTech = 10;
    defaultCombustionDrive = 10;
    defaultImpulseDrive = 8;
    defaultHyperspaceDrive = 6;

    validShips = [202,203,204,205,206,207,208,209,210,211,213,214,215];
    validConstructibleShips = [202,203,204,205,206,207,208,209,210,211,213,215];
    validMotors = [109,110,111];
    validBattleTechs = [115,117,118];

    defaultTechs = {
        '109' : this.defaultMilitaryTech,
        '110' : this.defaultShieldingTech,
        '111' : this.defaultArmorTech,
        '115' : this.defaultCombustionDrive,
        '117' : this.defaultImpulseDrive,
        '118' : this.defaultHyperspaceDrive
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
        '214':0, //Death star
        '215':0  //Battle cruiser
    };
    @observable techs = {
        '109' : this.defaultMilitaryTech,
        '110' : this.defaultShieldingTech,
        '111' : this.defaultArmorTech,
        '115' : this.defaultCombustionDrive,
        '117' : this.defaultImpulseDrive,
        '118' : this.defaultHyperspaceDrive
    };
    uniSpeed = 1;

    @observable distance = 0;
    @observable metal = 0;
    @observable crystal = 0;
    @observable deuterium = 0;
    @observable consumption = 0;
    @observable capacity = 0;
    @observable speed = 0;
    @observable spaceCredits = 0;
    @observable duration = 0;

    /* Ship builder variables */

    unitLimit = 999;

    @observable baseMetal = 0;
    @observable baseCrystal = 0;
    @observable baseDeuterium = 0;

    /* Space variables */

    @observable timeUnit = 0;

    planets = {
        "v-3455": {name:"V-3455"},
        "tau-wg": {name:"Tau-WG"}
    };
    
    @observable pastEvents = FixedQueue(20, []);
    
    landMarks = {
        '81000':{
            visited: false,
            action: () => {
                let onlyprobes = true;
                for(let i=0; i < this.validShips.length; i++){
                    let idx = this.validShips[i];

                    if(idx!='210' && shipList[idx]>0) {
                        onlyprobes = false;
                        break;
                    }
                }
                if(onlyprobes){
                    this.showEnding(this.gameEndings.missingProbes);
                }
            }
        },
        '80900':{
            visited: false,
            action: () => {
                this.changeState(this.gameStates.planet, this.planets["v-3455"]);
            }
        },
        '38500':{
            visited: false,
            action: () => {
                this.changeState(this.gameStates.planet, this.planets["tau-wg"]);
            }
        }
    };

    constructor() {

    }
    
    @action resetPastEvents(){
        this.pastEvents = [];
    }

    resetLandMarks(){
        for(let i=0; i < this.landMarks.length; i++){
            this.landMarks[i].visited = false;
        }
    }

    static calcProgress(durationMoment, maxDistance){
        var ticks = durationMoment * 0.6;
        return maxDistance / ticks;
    }

    showEnding(reason){
        if(reason in this.endingReason){
            switch(reason){
                case this.endingReason.success:
                    this.changeState(this.gameStates.endGood);
                    break;
                case this.endingReason.quitGame:
                    this.changeState(this.gameStates.home);
                    break;
                default:
                    this.changeState(this.gameStates.endBad);
                    break;
            }
        }
    }
    
    randomEvent(){
        
    }

    handleGameLoop = () => {

        let step = AppStore.calcProgress(this.duration, this.defaultDistance);

        if(this.distance < step){
            this.distance = 0;
            this.showEnding(this.gameEndings.success);
            return;
        } else {
            this.distance -= step;
        }

        if(this.deuterium < this.consumption){
            this.showEnding(this.gameEndings.noDeuterium);
            return;
        }
        this.deuterium -= this.consumption; //This triggers a capacity update, hopefully
        this.timeUnit += 1;
        
        for(id in this.landMarks){
            if(!this.landMarks.hasOwnProperty(id)){ continue; }
            
            if(this.distance < id && !this.landMarks[id].visited){
                this.landMarks[id].visited = true;
                this.landMarks.action();
                return;
            }        
        }

        if(Math.random() < this.EVENT_PROBABILITY){
            this.randomEvent();
        }
    };

    changeState(state, data){
        switch(state){
            case this.gameStates.home:
                break;
            case this.gameStates.ships:
                this.resetFleet();
                this.resetBaseResources();
                this.gameLoop.reset();
                this.gameLoop.setSpeed(this.intervalSpeed);
                this.gameLoop.setHandler(this.handleGameLoop);
                this.resetLandMarks();
                this.resetPastEvents();
                break;
            case this.gameStates.space:
                this.gameLoop.play();
                break;
            case this.gameStates.event:
                this.gameLoop.pause();
                //Do something with data
                break;
                break;
            case this.gameStates.battleResult:
                this.gameLoop.pause();
                //Do something with data
                break;
            case this.gameStates.planet:
                //Do something with data
                break;
            case this.gameStates.endBad:
                break;
            case this.gameStates.endGood:
                break;
            default:
                console.log("debug type of ships", typeof this.gameStates.ships);
                console.log("debug ships", this.gameStates.ships);
                console.log("debug type of new state", typeof state);
                console.warn("Unknown state...", state);
                return;
                break;
        }

        this.gameState = state;
    }

    /*  Fleet functions */

    @computed get shipCount(){
        let c = 0;
        for(var i=0; i < this.validShips.length;i++){
            c += this.ships[this.validShips[i]];
        }
        return c;
    }

    @computed get usedCapacity(){
        return this.metal + this.crystal + this.deuterium;
    }

    @action resetFleet() {
        for(let i=0; i < this.validShips.length;i++) {
            let idx = this.validShips[i];
            this.changeShipAmount(idx, 0);
        }
        for(let i=0; i < this.validMotors.length;i++) {
            let idx = this.validMotors[i];
            this.techs[idx] = this.defaultTechs[idx];
        }
        for(let i=0; i < this.validBattleTechs.length;i++) {
            let idx = this.validBattleTechs[i];
            this.techs[idx] = this.defaultTechs[idx];
        }

        this.metal = 0;
        this.crystal = 0;
        this.deuterium = 0;
        this.spaceCredits = 0;

        this.techs = this.defaultTechs;

        this.duration = 0;
        this.speed = 0;
        this.distance = this.defaultDistance;
        this.consumption = 0;
        this.capacity = 0;
        
        this.timeUnit = 0;
    }

    @action addResources(resources){
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
    }

    /* In game use addResources() instead */
    @action setResources(resources){
        this.metal = resources.metal;
        this.crystal = resources.crystal;
        this.deuterium = resources.deuterium;
    }

    @action setCapacity(capacity){
        this.capacity = capacity;
    }

    @action setDistance(distance){
        this.distance = distance;
    }

    @action setSpeed(speed){
        this.speed = speed;
    }

    @action setDuration(duration){
        this.duration = duration;
    }

    @action setConsumption(consumption){
        this.consumption = consumption;
    }

    @action changeTech(idx, num){
        if(idx in this.techs){
            this.techs[idx] = num;
        }
    }

    @action changeShipAmount(idx, num){
        if(idx in this.ships){
            this.ships[idx] = num;
        }

        let slowest = 9999999999,
            consumption = 0,
            speed = 0,
            capacity = 0,
            minDistance = this.minDistance,
            combustionDriveTech = this.techs['115'],
            impulseDriveTech = this.techs['117'],
            hyperspaceDriveTech = this.techs['118'],
            shipListExtra = {},
            distance = minDistance;


        for(let i=0; i < this.validShips.length;i++){

            let idx = this.validShips[i];
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
        console.log(this.capacity);

        let duration = 10 + 35000/this.uniSpeed * Math.sqrt((10*distance) / slowest ),

            sum = 0;

        for(let i=0; i < this.validShips.length;i++) {
            let idx = this.validShips[i];
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

    @computed get calcUsedCapacity(){
        return Math.min(this.baseMetal+this.baseCrystal+this.baseDeuterium,this.capacity);
    }
    
    @action resetBaseResources(){
        this.baseMetal = this.defaultMetal;
        this.baseCrystal = this.defaultCrystal;
        this.baseDeuterium = this.defaultDeuterium;
    }

    @action setBaseResources(resources){
        this.baseMetal = resources.metal;
        this.baseCrystal = resources.crystal;
        this.baseDeuterium = resources.deuterium;
    }

    @action tryUsingShipAmount(idx, amount, priceList){
        if(amount > this.unitLimit){
            amount = this.unitLimit;
        }
        if(!(idx in this.ships)){
            return;
        }

        if(this.ships[idx]==amount){
            // :)
        } else if(this.ships[idx] > amount){
            let dif = this.ships[idx] - amount;
            this.baseMetal = this.baseMetal + (dif * priceList.metal);
            this.baseCrystal = this.baseCrystal + (dif * priceList.crystal);
            this.baseDeuterium = this.baseDeuterium + (dif * priceList.deuterium);

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
                    this.baseMetal + originalMetalUsed >= extraMetal &&
                    this.baseCrystal + originalCrystalUsed >= extraCrystal &&
                    this.baseDeuterium + originalDeuteriumUsed >= extraDeuterium
                ) {
                    break;
                }

                dif--;
                amount = this.ships[idx] + dif;
            }

            this.baseMetal = this.baseMetal - (dif * priceList.metal);
            this.baseCrystal = this.baseCrystal - (dif * priceList.crystal);
            this.baseDeuterium = this.baseDeuterium - (dif * priceList.deuterium);

            this.changeShipAmount(idx, amount);
        }
    }

    /* Space */

    @computed get calcMapDistance(){
        return this.mapWidth - ((this.distance * this.mapWidth) / this.defaultDistance);
    }
    
    formatTime(num){
        new Date(num * 1000).toISOString().substr(14, 5);
    }
    
    @computed get timeUnitFormatted(){
        return this.formatTime(this.timeUnit);
    }
}

export default AppStore;
