import { action } from 'mobx';

import GameState from './Model/GameState';
import ExchangeRate from './ExchangeRate';
import Space from './Model/Space';
import Fleet from './Model/Fleet';
import Event from './Model/Event';

export default class EventManager {

    static EVENT_PROBABILITY = 0.15;

    static types = {
        'supernova': {
            dialogs: [{title:"Giant Star collapsing",description:"Will we be able to escape?"}],
            actions: ['continue']
        },
        'black-hole': {
            dialogs: [
                {title:"Black Hole",description:'Wrong coordinates!! Init evasion maneuvers!'},
                {title:"Black Hole",description:'Our maps of this sector are wrong, and now we have encountered a Black Hole.'}
            ],
            actions: ['continue']
        },
        'remove-ships' : {
            dialogs: [
                {title:"Ships lost",description:"Some ships had a major malfunction"},
                {title:"Ships lost",description:"A part of our fleet was destroyed by an explosive Esp. Probe sent by Pirates"}
            ],
            actions: ['continue']
        },
        'remove-space-credits': {
            dialogs: [
                {title:"We lost Space Credits",
                    description:"Solar system limits. In order to continue we had to pay a toll of %s Space Credits to the Confederates"},
                {title:"We lost Space Credits",
                    description:"An Enemy Espionage Probe stole %s Space Credits from us, we were not able to track it."}],
            actions: ['continue']
        },
        'add-space-credits': {
            dialogs: [
                {title:"Free Space Credits",description:"We found our lost wallet with %s Space Credits!"},
                {title:"Free Space Credits",description:"Bank Error in your favor. Collect %s Space Credits. (Actually, that\'s not how it works in real life)"}
            ],
            actions: ['continue']
        },
        'remove-resource' : {
            dialogs: [
                {title:"Lost some resources,",description:"A storage tank exploded, and we lost %s %t"},
                {title:"Lost some resources",description:"Pirate Probes took away some of our resources!"}
            ],
            actions: ['continue']
        },
        'add-ships' : {
            dialogs: [
                {"title":"New Ships!","description":"We found operational ships in a desert planet!"},
                {"title":"New Ships!","description":"A group of mercenaries want to join our party"}
            ],
            actions: ['take','skip']
        },
        'add-resource': {
            dialogs: [
                {"title":"Found some resources","description":"There is a lonely floating container with %s of %t"},
                {"title":"Found some resources","description":"We found an asteroid with %s of %t"}],
            actions: ['take', 'skip']
        },
        'steal-battle': {
            dialogs: [{"title":"Battle","description":"We caught a fleet of %c which stole %s %t from us a few moments ago"}],
            actions: ['attack','flee','negotiate']
        },
        'slow-down': {
            dialogs: [{title:"Malfunction", description:"One of the motors of the main ship failed, this will slow down the mission for a while"}],
            actions: ['continue']
        },
        'speed-up': {
            dialogs: [{title:"Vortex", description: "A vortex trapped our fleet. We are moving at a higher speed!"}],
            actions: ['continue']
        },
        'raid-planet': {
            dialogs: [{title:"Fortified Planet",description:"We found a fortified planet of %c in the way"}],
            actions: ['attack', 'flee']
        },
        'battle': {
            dialogs: [{"title":"Battle","description":"We encountered a fleet of %c. There is a bounty on them"}],
            actions: ['attack', 'flee']
        },
        'nothing': {
            dialogs: [
                {title:"Space Radio",description:"Probes are very useful, you should bring some with you if possible..."},
                {title:"Break Time",description:'The Commander organized an Essay Contest about the Space. He won.'},
                {title:"Confederate Fleet",description:"A Confederate Fleet was seen nearby. They have Recyclers and Colony Ships, with low running speed."},
                {title:"Exotic Planet",description:"We found a planet with weird living things. Amazing! Nothing we have ever seen before..."},
                {title:"Space Nebula",description:"There is a shiny Nebula nearby, and we decided to take some photos from it"}],
            actions: ['continue']
        },
        'custom': {
            dialogs: []
        }
    };

    static enemyTypes = {
        'pirates': {
            minTech: 4,
            maxTech: 5,
            name: 'Space Pirates'
        },
        'scourge': {
            minTech: 7,
            maxTech: 10,
            name: 'The Scourge'
        },
        'quadrant-12':{
            minTech: 10,
            maxTech: 13,
            name: 'Quadrant 12'
        }
    };

    static validEventResources = ['metal','crystal','deuterium'];
    static validRemovableShipsArray = [202,203,204,205,206,210];
    static validRemovableShips = {
        '202':{min:1,max:5},
        '203':{min:1,max:2},
        '204':{min:1,max:20},
        '205':{min:1,max:10},
        '206':{min:1,max:2},
        '207':{min:1,max:1},
        '210':{min:1,max:20},
        '215':{min:1,max:1}
    };
    static validObtainableShipsArray = [202,203,204,205,206,210,215];
    static validObtainableShips = {
        '202':{min:1,max:20},
        '203':{min:1,max:5},
        '204':{min:1,max:40},
        '205':{min:1,max:20},
        '206':{min:1,max:6},
        '207':{min:1,max:4},
        '210':{min:1,max:40},
        '213':{min:1,max:1},
        '215':{min:1,max:2}
    };

    after = null;

    constructor(store){
        this.store = store;
    }

    @action init(type, params){
        let event = this.store.currentEvent, resource_name, item, amount, result, idx, ship_type,
            descriptions, description, rawShips, enemy, priceList = window.bvConfig.shipData;
        event.metal = 0;
        event.crystal = 0;
        event.deuterium = 0;
        event.spaceCredits = 0;

        let gameState = GameState.states.event;

        event.resetActions();
        if(type!='custom' && EventManager.types[type] ){
            descriptions = EventManager.types[type];
            description = descriptions.dialogs[Math.random() * descriptions.dialogs.length|0];
            event.title = description.title;
            event.description = description.description;
            event.enableActions(descriptions.actions);
        }

        event.type = type;

        switch(type) {
            case 'nothing':
                this.after = Event.nothingAction;
                break;
            case 'raid-planet':
                this.store.enemyFleet.resetShips();
                rawShips = EventManager.getRandomShips(this.store.playerFleet.distance, Space.defaultDistance, 'raid-planet');
                enemy = EventManager.getRandomEnemy();

                this.store.enemyFleet.assignTechs(enemy.techs);
                event.spaceCredits = (this.calcRewardValueAndAssing(rawShips, enemy.type) * 2) | 0;
                event.description = event.description.replace('%c', enemy.name);

                this.after = Event.raidPlanetAction;
                break;
            case 'battle':
                this.store.enemyFleet.resetShips();
                rawShips = EventManager.getRandomShips(this.store.playerFleet.distance, Space.defaultDistance);
                enemy = EventManager.getRandomEnemy();

                this.store.enemyFleet.assignTechs(enemy.techs);
                event.spaceCredits = this.calcRewardValueAndAssing(rawShips, enemy.type) | 0;
                event.description = event.description.replace('%c', enemy.name);
                this.after = Event.battleAction;

                break;
            case 'steal-battle':
                this.store.enemyFleet.resetShips();
                rawShips = EventManager.getRandomShips(this.store.playerFleet.distance, Space.defaultDistance);
                enemy = EventManager.getRandomEnemy();

                this.store.enemyFleet.assignTechs(enemy.techs);
                event.spaceCredits = this.calcRewardValueAndAssing(rawShips, enemy.type) | 0;

                result = this.removeRandomResources(Fleet.calcCapacity(rawShips), true);
                if (!result.resource_name) {
                    //Game over?
                    gameState = GameState.states.space;
                    break;
                }
                this.store.enemyFleet.assignTechs(enemy.techs);
                event.spaceCredits = this.calcRewardValueAndAssing(rawShips, enemy.type) | 0;
                event.description = ((event.description.replace('%c', enemy.name))
                    .replace('%s', result.amount)).replace('%t', result.resource_name);

                this.after = Event.stealBattleAction;
                break;
            case 'add-resource':
                item = Math.floor(Math.random() * 3);
                resource_name = EventManager.validEventResources[item];
                amount = EventManager.randomIntFromInterval(2000, 20000);
                event[resource_name] = amount;

                event.description = ((event.description.replace('%s', amount)).replace('%t', resource_name))
                    +". Do we have enough storage available?";
                this.after = Event.addResourceAction;
                break;

            case 'remove-resource':
                if (this.store.playerFleet.shipsExpanded['210'].amount) {
                    gameState = GameState.states.space;
                    this.store.pastEvents.push({
                        time: this.store.playerFleet.timeUnit,
                        message: "Thieves detected! They ran away!", "type": 'warning'
                    });
                    break;
                }
                result = this.removeRandomResources(30000, false);
                if (!result.resource_name) {
                    //Game over?
                    gameState = GameState.states.space;
                    break;
                }
                event.description = (event.description.replace('%s', result.amount)).replace('%t', result.resource_name);
                this.after = Event.resourcesLostAction;
                break;
            case 'add-space-credits':
                amount = EventManager.randomIntFromInterval(400, 4000);

                this.store.playerFleet.spaceCredits += amount;
                event.spaceCredits = amount;
                event.description = (event.description).replace('%s', amount);

                this.after = Event.spaceCreditsGainedAction;
                break;
            case 'remove-space-credits':
                if (this.store.playerFleet.shipsExpanded['210'].amount) {
                    gameState = GameState.states.space;
                    this.store.pastEvents.push({
                        time: this.store.playerFleet.timeUnit,
                        message: "Thieves detected! They ran away!", "type": 'warning'
                    });
                    break;
                }

                amount = Math.min(EventManager.randomIntFromInterval(200, 2000), this.store.playerFleet.spaceCredits);
                if (!amount) {
                    gameState = GameState.states.space;
                    this.store.pastEvents.push({
                        time: this.store.playerFleet.timeUnit,
                        message: "We take some photos!",
                        "type": 'warning'
                    });
                    break;
                }
                this.store.playerFleet.spaceCredits -= amount;
                event.spaceCredits = -amount;
                event.description = (event.description).replace('%s', amount);

                this.after = Event.spaceCreditsLostAction;
                break;
            case 'slow-down':
                this.store.playerFleet.speedEffectCounter = 25;
                this.store.playerFleet.fleetSpeed = EventManager.randomIntFromInterval(4, 9);
                this.store.playerFleet.updateStats(priceList);

                this.after = Event.speedChangedAction;
                break;

            case 'speed-up':
                this.store.playerFleet.speedEffectCounter = 25;
                this.store.playerFleet.fleetSpeed = EventManager.randomIntFromInterval(11, 16);
                this.store.playerFleet.updateStats(priceList);

                this.after = Event.speedChangedAction;
                break;

            case 'add-ships':
                item = Math.floor(Math.random() * EventManager.validObtainableShipsArray.length);
                idx = EventManager.validObtainableShipsArray[item];
                ship_type = EventManager.validObtainableShips[idx];
                amount = EventManager.randomIntFromInterval(ship_type.min, ship_type.max);
                if (!amount) {
                    gameState = GameState.states.space;
                    this.store.pastEvents.push(
                        {
                            time: this.store.playerFleet.timeUnit,
                            message: "We take some photos!",
                            "type": 'warning'
                        });
                    break;
                }
                this.store.playerFleet.shipsExpanded[EventManager.validObtainableShipsArray[item]].changes = amount;

                this.after = Event.addShipsAction;
                break;
            case 'remove-ships':
                item = Math.floor(Math.random() * EventManager.validRemovableShipsArray.length);
                idx = EventManager.validRemovableShipsArray[item];
                ship_type = EventManager.validRemovableShips[idx];
                amount = Math.min(EventManager.randomIntFromInterval(ship_type.min, ship_type.max),
                    this.store.playerFleet.shipsExpanded[idx].amount);
                if (idx == '210') {
                    amount--;
                }
                if (!amount) {
                    gameState = GameState.states.space;
                    this.store.pastEvents.push({
                        time: this.store.playerFleet.timeUnit,
                        message: "An enemy probe passed by!", "type": 'warning'
                    });
                    break;
                }
                this.store.playerFleet.shipsExpanded[idx].changes = -amount;
                this.after = Event.removeShipsAction;
                break;
            case 'supernova':
                if (this.store.playerFleet.shipsExpanded['210'].amount) {
                    gameState = GameState.states.space;
                    this.store.pastEvents.push({
                        time: this.store.playerFleet.timeUnit,
                        message: "We detected a Super Nova explosion and escaped!", "type": 'warning'
                    });
                    break;
                }

                event.description = event.description + '. Survival chance: 80%';
                this.after = Event.superNovaAction;
                break;
            case 'black-hole':
                if(this.store.playerFleet.shipsExpanded['210'].amount){
                    gameState = GameState.states.space;
                    this.store.pastEvents.push({
                        time:this.store.playerFleet.timeUnit,
                        message:"We detected a Black Hole and escaped!","type":'warning'});
                    break;
                }
                event.description = event.description + '. Survival chance: 80%';
                this.after = Event.blackHoleAction;
                break;
            case 'custom':
                event.title = params.title;
                event.description = params.description;
                event.enableActions( params.actions );
                if(params.before){
                    params.before(store);
                }
                this.after = params.after;
                break;
            default:
                console.log("Unknown type", eventType);
                gameState = GameState.states.space;
                break;
        }

        return gameState;
    }

    @action trigger(action){
        if(this.after){
            this.after(this.store, this.store.currentEvent, action);
        }
    }

    @action removeRandomResources(cap, canRecover=false){
        let amount;
        let item = Math.floor(Math.random() * 3);
        let resource_name = EventManager.validEventResources[item];
        do {
            if(canRecover){
                amount = Math.min(EventManager.randomIntFromInterval(4000,40000), this.store.playerFleet[resource_name], cap);
            } else {
                amount = Math.min(EventManager.randomIntFromInterval(3000,cap), this.store.playerFleet[resource_name]);
            }

            if(!amount){
                if(this.store.playerFleet.deuterium){
                    resource_name = 'deuterium';
                } else {
                    break;
                }
            } else {
                break;
            }
        } while(true);
        if(!amount)
        {
            //If there is no deuterium, why are we here?
            return {amount: 0, resource_name: null};
        }
        this.store.playerFleet[resource_name] -= amount; //We remove the amount for now
        if(canRecover){
            this.store.currentEvent[resource_name] = amount; //You might recover it back
        } else {
            this.store.currentEvent[resource_name] = -amount;
        }
        return {amount: amount, resource_name: resource_name};
    }


    @action calcRewardValueAndAssing(rawShips, type){
        let priceList = window.bvConfig.shipData, rewardValue = 0;

        let resources = {metal:0,crystal:0,deuterium:0};
        for(let idx in rawShips){
            if(!rawShips.hasOwnProperty(idx)) continue;
            if(!rawShips[idx]) continue;

            resources.metal = rawShips[idx] * priceList[idx].metal;
            resources.crystal = rawShips[idx] * priceList[idx].crystal;
            resources.deuterium = rawShips[idx] * priceList[idx].deuterium;

            this.store.enemyFleet.shipsExpanded[idx].amount = rawShips[idx];
            rewardValue += ExchangeRate.resourcesToSpaceCredits(resources, ExchangeRate.NORMAL);
        }
        switch(type){
            case 'pirates':
                rewardValue = rewardValue / 2.5;
                break;
            case 'scourge':
                rewardValue = rewardValue / 2;
                break;
            case 'quadrant-12':
                rewardValue = rewardValue / 1.5;
                break;
        }
        return rewardValue;
    }

    getRandomEventId(){
        const rn = Math.random();

        if(rn < 0.01){ return 'supernova'; }
        if(rn < 0.02){ return 'black-hole'; }
        if(rn < 0.06){ return 'remove-ships'; }
        if(rn < 0.11){ return 'remove-space-credits'; }
        if(rn < 0.17){ return 'add-space-credits'; }
        if(rn < 0.22){ return 'remove-resource'; }
        if(rn < 0.28){ return 'add-ships'; }
        if(rn < 0.36){ return 'add-resource'; }
        if(rn < 0.42){ return 'slow-down'; }
        if(rn < 0.50){ return 'speed-up'; }
        if(rn < 0.60){ return 'steal-battle'; }

        let amBombers = this.store.playerFleet.shipsExpanded['211'].amount,
            amRecyclers = this.store.playerFleet.shipsExpanded['209'].amount;

        //Bombers bring raid battles with them
        //If you have recyclers in your fleet, you will get more resources than normal
        if(amBombers && amRecyclers){
            if(rn < 0.70){
                return 'raid-planet';
            }
            if(rn < 0.80){
                return 'add-resource';
            }
        } else if(amBombers){
            if(rn < 0.70){
                return 'raid-planet';
            }
        } else if(amRecyclers){
            if(rn < 0.70){
                return 'add-resource';
            }
        }
        if(rn < 0.90){ return 'battle'; }
        return 'nothing';
    }

    static randomIntFromInterval(min,max)
    {
        return Math.floor(Math.random()*(max-min+1)+min);
    }

    static getMaxProbableShipType(length, distance, maxDistance){

        return 1 + Math.min(Math.ceil(Math.sqrt( ((maxDistance - distance)/maxDistance)*100 )*length/10), length);
    }

    static getMaxProbableShipTypeCount(distance, maxDistance, extra=1){
        return Math.ceil(((maxDistance - distance)/maxDistance) * 10) + extra;
    }

    static getMaxProbableShipAmount(distance, maxDistance){
        return Math.ceil(((maxDistance - distance)/maxDistance) * 40) + 10;
    }

    static getRandomEnemy(){
        const rand = Math.random();
        let enemy = {'type':'','name':'',techs:{'109':0,'110':0,'111':0}};

        if(rand < 0.3){
            enemy.type = 'pirates';
        } else if(rand < 0.7){
            enemy.type = 'scourge';
        } else {
            enemy.type = 'quadrant-12';
        }
        enemy.name = EventManager.enemyTypes[enemy.type].name;
        enemy.techs['109'] = EventManager.randomIntFromInterval(
            EventManager.enemyTypes[enemy.type].minTech,EventManager.enemyTypes[enemy.type].maxTech);
        enemy.techs['110'] = EventManager.randomIntFromInterval(
            EventManager.enemyTypes[enemy.type].minTech,EventManager.enemyTypes[enemy.type].maxTech);
        enemy.techs['111'] = EventManager.randomIntFromInterval(
            EventManager.enemyTypes[enemy.type].minTech,EventManager.enemyTypes[enemy.type].maxTech);
        return enemy;
    }

    static getRandomShips(distance, maxDistance, type='battle'){
        let maxProbableShipType, pickableFleet, maxProbableShipTypeCount;

        if(type=='battle'){
            maxProbableShipType = EventManager.getMaxProbableShipType(Fleet.validEnemyShips.length, distance, maxDistance);
            pickableFleet = Fleet.validEnemyShips.slice(0, maxProbableShipType-1);
            maxProbableShipTypeCount = EventManager.getMaxProbableShipTypeCount(distance, maxDistance, 1);
        } else {
            maxProbableShipType = EventManager.getMaxProbableShipType(Fleet.validEnemyDefense.length, distance, maxDistance);
            pickableFleet = Fleet.validEnemyDefense.slice(0, maxProbableShipType-1);
            maxProbableShipTypeCount = EventManager.getMaxProbableShipTypeCount(distance, maxDistance, 1);
        }

        const minProbableShipTypeCount = Math.max(maxProbableShipTypeCount/3, 1);
        const maxProbableShipTypeAmount = EventManager.getMaxProbableShipAmount(distance, maxDistance);
        const minProbableShipTypeAmount = Math.max(maxProbableShipTypeAmount/5, 1);

        let realFleet = {}, idx, pos,
            max = EventManager.randomIntFromInterval(minProbableShipTypeCount,maxProbableShipTypeCount)+1;
        for(let i=minProbableShipTypeCount; i < max; i++){
            pos = Math.random() * pickableFleet.length|0;
            idx = pickableFleet[pos];

            if(!realFleet[idx]){
                if(idx=='407' || idx=='408') {
                    realFleet[idx] = 1;
                } else {
                    realFleet[idx] = EventManager.randomIntFromInterval(minProbableShipTypeAmount, maxProbableShipTypeAmount);
                }
            }
        }
        return realFleet;
    }



};