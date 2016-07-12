import { observable, action } from 'mobx';

import GameState from './GameState';
import Fleet from './Fleet';
import Space from './Space';
import ExchangeRate from '../ExchangeRate';
import BattleManager from '../BattleManager';

class GameEvent {

    static EVENT_PROBABILITY = 0.15;
    
    static types = {
        'supernova': {
            dialogs: [{title:"Giant Star collapsing",description:"Will we be able to escape?"}]
        },
        'black-hole': {
            dialogs: [
                {title:"Black Hole",description:'Wrong coordinates!! Init evasion maneuvers!'},
                {title:"Black Hole",description:'Our maps of this sector are wrong, and now we have encountered a Black Hole.'}
            ]
        },
        'remove-ships' : {
            dialogs: [
                {title:"Ships lost",description:"Some ships had a malfunction"},
                {title:"Stolen ships",description:"A part of our fleet was taken away by space Pirates"}
            ]
        },
        'remove-space-credits': {
            dialogs: [
                {title:"We lost Space Credits",
                description:"Solar system limits. In order to continue we had to pay a toll of %s Space Credits to the Confederates"},
                {title:"We lost Space Credits",
                description:"An Enemy Espionage Probe stole %s Space Credits from us, we were not able to track it."}]
        },
        'add-space-credits': {
            dialogs: [
                {title:"Free Space Credits",description:"We found our lost wallet with %s Space Credits!"},
                {title:"Free Space Credits",description:"Bank Error in your favor. Collect %s Space Credits. (Actually, that\'s not how it works in real life)"}
            ]
        },
        'remove-resource' : {
            dialogs: [
                {title:"Lost some resources,",description:"An storage tank exploded, and we lost %s %t"},
                {title:"Lost some resources",description:"Pirate Probes took away some of our stuff!"}
            ]
        },
        'add-ships' : {
            dialogs: [
                {"title":"New Ships!","description":"We found operational ships in a desert planet!"},
                {"title":"New Ships!","description":"A group of mercenaries want to join our party"}
            ]
        },
        'add-resource': {
            dialogs: [
                {"title":"Found some resources","description":"There is a lonely floating container with %s of %t nearby"},
                {"title":"Found some resources","description":"We found an asteroid with %s of %t, what should we do?"}]
        },
        'steal-battle': {
            dialogs: [{"title":"Battle","description":"We caught a fleet of %c which stole %s %t from us a few moments ago"}]
        },
        'slow-down': {
            dialogs: [{title:"Malfunction", description:"One of the motors of the main ship failed, this will slow down the mission for a while"}]
        },
        'speed-up': {
            dialogs: [{title:"Vortex", description: "A vortex trapped our fleet. We are moving at a higher speed!"}]
        },
        'raid-planet': {
            dialogs: [{title:"Fortified Planet",description:"We found a fortified planet of %c in the way"}]
        },
        'battle': {
            dialogs: [{"title":"Battle","description":"We encountered a fleet of %c. It seems there is a reward available"}]
        },
        'nothing': {
            dialogs: [
                {title:"Space Contest",description:'The Commander organized an Essay Contest. He won.'},
                {title:"Confederate Fleet",description:"A Confederate Fleet was seen nearby. They have Recyclers and Colony Ships, with low running speed."},
                {title:"Exotic Planet",description:"We found a planet with weird living things. Amazing! Nothing we have ever seen before..."},
                {title:"Space Nebula",description:"There is a shiny Nebula nearby, and we decided to take some photos from it"}]
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

    static defaultEvent = {
        title: 'Event',
        type: 'nothing',
        description: 'Nothing interesting',
        actions: ['continue'],
        after : function(event){
            event.store.changeState(GameState.states.space);
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
    store = null;

    @observable title = '';
    @observable type = 'nothing';
    
    @observable metal = 0;
    @observable crystal = 0;
    @observable deuterium = 0;
    @observable spaceCredits = 0;
    
    @observable validActions = {
        continue : false,
        take : false,
        skip : false,
        attack : false,
        flee : false,
        negotiate : false,
        return : false
    };
    
    constructor(store){
        this.store = store;
    }

    static handleFleeEvent(event, resource_name, action){
        event.spaceCredits = 0;

        let extraDesc = '';

        if(resource_name){
            event[resource_name] = -event[resource_name];
            event.description = 'We left the resources behind!';
            extraDesc = 'Ran away from some thieves!';
        } else {
            if(action=='battle'){
                event.description = 'We ran away!';
                extraDesc = 'Ran away from a battle!';
            } else if(action=='raid-planet'){
                event.description = 'We decided not to attack for now';
                extraDesc = 'Enemy planet sighted';
            } else {

            }
        }
        event.store.pastEvents.push({time:event.store.playerFleet.timeUnit, message:extraDesc,"type":'warning'});
        setTimeout(function(){
            event.store.changeState(GameState.states.space);
        }, 2000);
    }

    static handleBattleEvent(event, choice, action){
        event.store.battleManager.init(function(result) {
            switch (result) {
                case BattleManager.WIN:
                    event.storeResources();
                    if(choice=='attack'){
                        event.description = 'We won the battle and earned '+event.spaceCredits+' Credits';
                    } else if(event.type=='raid-planet') {
                        event.description = 'We won the battle and earned '+event.spaceCredits+' Credits';
                    } else {
                        event.description = 'We couldn\'t escape, but we won the battle and earned '+event.spaceCredits+' Credits';
                    }
                    setTimeout(function () {
                        event.store.playerFleet.applyBattleResults();
                        if(event.type=='battle'){
                            event.store.pastEvents.push({
                                time: event.store.playerFleet.timeUnit,
                                message: "Defeated an enemy fleet!",
                                "type": 'success'
                            });
                        } else if(event.type=='raid-planet'){
                            event.store.pastEvents.push({
                                time: event.store.playerFleet.timeUnit,
                                message: "Raided an enemy planet",
                                "type": 'success'
                            });
                        } else {
                            event.store.pastEvents.push({
                                time: event.store.playerFleet.timeUnit,
                                message: "Defeated some thieves!",
                                "type": 'success'
                            });
                        }
                        event.store.changeState(GameState.states.space);
                    }, 5000);
                    break;
                case BattleManager.LOST:
                    if(choice=='attack'){
                        event.description = 'We lost the battle...';
                    } else {
                        event.description = 'We couldn\'t escape. We lost the battle...';
                    }
                    setTimeout(function () {
                        event.store.showEnding(GameState.endings.noShips);
                    }, 5000);
                    break;
                case BattleManager.DRAW:
                    event.spaceCredits = 0;
                    event.storeResources();
                    if(choice=='attack'){
                        event.description = 'Draw battle!';
                    } else {
                        event.description = 'We couldn\'t escape. Draw battle!';
                    }
                    setTimeout(function () {
                        event.store.playerFleet.applyBattleResults();
                        if(event.type=='battle'){
                            event.store.pastEvents.push({
                                time: event.store.playerFleet.timeUnit,
                                message: "Found an enemy fleet!",
                                "type": 'warning'
                            });
                        } else {
                            event.store.pastEvents.push({
                                time: event.store.playerFleet.timeUnit,
                                message: "Found some thieves!",
                                "type": 'warning'
                            });
                        }
                        event.store.changeState(GameState.states.space);
                    }, 5000);
                    break;
                default:
                    console.log("Event error", result);
                    break;
            }
        });
    }

    @action calcRewardValueAndAssing(ships, type){
        let priceList = window.bvConfig.shipData, rewardValue = 0;

        let resources = {metal:0,crystal:0,deuterium:0};
        for(let idx in ships){
            if(!ships.hasOwnProperty(idx)) continue;
            if(!ships[idx]) continue;

            resources.metal = ships[idx] * priceList[idx].metal;
            resources.crystal = ships[idx] * priceList[idx].crystal;
            resources.deuterium = ships[idx] * priceList[idx].deuterium;

            this.store.enemyFleet.ships[idx] = ships[idx];
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

    @action storeResources(){
        //Resources might be negative or positive
        this.store.playerFleet.setResources({
            metal: this.store.playerFleet.metal + this.metal,
            crystal: this.store.playerFleet.crystal + this.crystal,
            deuterium: this.store.playerFleet.deuterium + this.deuterium
        });
        this.store.playerFleet.spaceCredits += this.spaceCredits;
    }

    @action init(eventType, params=null){
        let newEvent = GameEvent.defaultEvent,
            refType = GameEvent.types[eventType],
            item,
            resource_name,
            amount,
            priceList,
            ships,
            enemy,
            resources,
            idx,
            ship_type,
            gameState = GameState.states.event;

        newEvent.params = {};
        newEvent.type = eventType;
        
        this.metal = 0;
        this.crystal = 0;
        this.deuterium = 0;
        this.spaceCredits = 0;

        switch(eventType){
            case 'nothing':
                item = Math.random() * refType.dialogs.length|0;
                newEvent.title = refType.dialogs[item].title;
                newEvent.description = refType.dialogs[item].description;
                newEvent.actions = ['continue'];
                newEvent.after = function(event){
                    event.store.pastEvents.push({time:event.store.playerFleet.timeUnit, message:"Found something in the way","type":'info'});
                    event.store.changeState(GameState.states.space);
                };
                break;
            case 'raid-planet':
                this.store.enemyFleet.resetShips();

                priceList = window.bvConfig.shipData;

                ships = GameEvent.getRandomShips(this.store.playerFleet.distance, Space.defaultDistance, 'raid-planet');
                enemy = GameEvent.getRandomEnemy();

                this.store.enemyFleet.assignTechs(enemy.techs);
                this.spaceCredits = (this.calcRewardValueAndAssing(ships, enemy.type) * 2)|0;

                item = Math.random() * refType.dialogs.length|0;
                newEvent.title = refType.dialogs[item].title;
                newEvent.description = (refType.dialogs[item].description.replace('%c', enemy.name));
                newEvent.actions = ['attack','flee'];
                newEvent.after = function(event,action){

                    event.validActions.attack = false;
                    event.validActions.flee = false;

                    switch(action){
                        case 'attack':
                            GameEvent.handleBattleEvent(event, action, 'raid-planet');
                            break;
                        case 'flee':
                            GameEvent.handleFleeEvent(event, null, 'raid-planet');
                            break;
                    }
                };
                break;


            case 'battle':
                this.store.enemyFleet.resetShips();

                priceList = window.bvConfig.shipData;

                ships = GameEvent.getRandomShips(this.store.playerFleet.distance, Space.defaultDistance);
                enemy = GameEvent.getRandomEnemy();

                this.store.enemyFleet.assignTechs(enemy.techs);
                this.spaceCredits = this.calcRewardValueAndAssing(ships, enemy.type)|0;

                item = Math.random() * refType.dialogs.length|0;
                newEvent.title = refType.dialogs[item].title;
                newEvent.description = (refType.dialogs[item].description.replace('%c', enemy.name));
                newEvent.actions = ['attack','flee'];
                newEvent.after = function(event,action){

                    event.validActions.attack = false;
                    event.validActions.flee = false;

                    switch(action){
                        case 'attack':
                            GameEvent.handleBattleEvent(event, action, 'battle');
                            break;
                        case 'flee':
                            if(Math.random() > 0.5){
                                GameEvent.handleFleeEvent(event, null, 'battle');
                            } else {
                                GameEvent.handleBattleEvent(event, action, 'battle');
                            }
                            break;
                    }
                };
                break;
            case 'steal-battle':
                this.store.enemyFleet.resetShips();

                priceList = window.bvConfig.shipData;

                ships = GameEvent.getRandomShips(this.store.playerFleet.distance, Space.defaultDistance);
                enemy = GameEvent.getRandomEnemy();

                var cap = Fleet.calcCapacity(ships);

                item = Math.floor(Math.random() * 3);
                resource_name = GameEvent.validEventResources[item];

                do {
                    amount = Math.min(GameEvent.randomIntFromInterval(4000,40000), this.store.playerFleet[resource_name], cap);
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
                    gameState = GameState.states.space;
                    break;
                }
                this.store.playerFleet[resource_name] -= amount; //We remove the amount for now

                this[resource_name] = amount; //You might recover it back

                this.store.enemyFleet.assignTechs(enemy.techs);
                this.spaceCredits = this.calcRewardValueAndAssing(ships, enemy.type)|0;

                item = Math.random() * refType.dialogs.length|0;
                newEvent.title = refType.dialogs[item].title;
                newEvent.description = ((refType.dialogs[item].description.replace('%c', enemy.name))
                                            .replace('%s', amount)).replace('%t', resource_name);
                newEvent.actions = ['attack','flee','negotiate'];
                newEvent.after = function(event,action){

                    event.validActions.negotiate = false;
                    event.validActions.attack = false;
                    event.validActions.flee = false;

                    switch(action){
                        case 'negotiate':
                            event.spaceCredits = 0;
                            event.type = 'nothing';

                            if(Math.random() > 0.5){
                                event[resource_name] = -event[resource_name];
                                event.description = 'They ran away with our minerals!';
                            } else {
                                event.storeResources();
                                event.description = 'We got our resources back! They\'ve just left';
                            }

                            event.store.pastEvents.push({time:event.store.playerFleet.timeUnit, message:"Found some thieves!","type":'warning'});
                            setTimeout(function(){
                                event.store.changeState(GameState.states.space);
                            }, 2000);
                            break;
                        case 'flee':

                            if(Math.random() > 0.5){
                                GameEvent.handleFleeEvent(event, resource_name, 'steal-battle');
                                break;
                            } else {
                                GameEvent.handleBattleEvent(event, action, 'steal-battle');
                            }

                            break;
                        case 'attack':
                        default:
                            GameEvent.handleBattleEvent(event, action, 'steal-battle');
                            break;
                    }
                };
                break;
            case 'add-resource':
                item = Math.floor(Math.random() * 3);
                resource_name = GameEvent.validEventResources[item];
                amount = GameEvent.randomIntFromInterval(2000,20000);
                this[resource_name] = amount;

                item = Math.random() * refType.dialogs.length|0;
                newEvent.title = refType.dialogs[item].title;
                newEvent.description = (refType.dialogs[item].description
                                            .replace('%s', amount)).replace('%t', resource_name);
                newEvent.actions = ['take','skip'];

                newEvent.after = function(event,action){
                    event.store.pastEvents.push({time:event.store.playerFleet.timeUnit, message:"Resources sighted","type":'info'});
                    switch(action){
                        case 'take':
                            event.storeResources();
                            event.store.changeState(GameState.states.space);
                            break;
                        case 'skip':
                        default:
                            event.validActions.skip = false;
                            event.validActions.take = false;
                            event.description = 'We left the resources behind!';
                            setTimeout(function(){
                                event.store.changeState(GameState.states.space);
                            }, 2000);
                            break;
                    }
                };

                break;
            case 'remove-resource':
                if(this.store.playerFleet.ships['210']){
                    gameState = GameState.states.space;
                    this.store.pastEvents.push({time:this.store.playerFleet.timeUnit, message:"Thieves detected! They ran way!","type":'warning'});
                    break;
                }

                item = Math.floor(Math.random() * 3);
                resource_name = GameEvent.validEventResources[item];
                do {
                    amount = Math.min(GameEvent.randomIntFromInterval(3000,30000), this.store.playerFleet[resource_name], cap);
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
                    gameState = GameState.states.space;
                    break;
                }
                this.store.playerFleet[resource_name] -= amount;

                this[resource_name] = -amount;
                item = Math.random() * refType.dialogs.length|0;
                newEvent.title = refType.dialogs[item].title;
                newEvent.description = (refType.dialogs[item].description
                                            .replace('%s', amount)).replace('%t', resource_name);
                newEvent.actions = ['continue'];
                newEvent.after = function(event){
                    event.store.pastEvents.push({time:event.store.playerFleet.timeUnit, message:"Resources lost","type":'error'});
                    event.store.changeState(GameState.states.space);
                };
                break;
            case 'add-space-credits':
                amount = GameEvent.randomIntFromInterval(400,2000);

                this.store.playerFleet.spaceCredits += amount;
                this.spaceCredits = amount;
                
                item = Math.random() * refType.dialogs.length|0;
                newEvent.title = refType.dialogs[item].title;
                newEvent.description = refType.dialogs[item].description.replace('%s', amount);
                newEvent.actions = ['continue'];
                newEvent.after = function(event){
                    event.store.pastEvents.push({time:event.store.playerFleet.timeUnit, message:"Space Credits found!","type":'success'});
                    event.store.changeState(GameState.states.space);
                };
                break;
            case 'remove-space-credits':
                if(this.store.playerFleet.ships['210']){
                    gameState = GameState.states.space;
                    this.store.pastEvents.push({time:this.store.playerFleet.timeUnit, message:"Thieves detected! They ran way!","type":'warning'});
                    break;
                }

                amount = Math.min(GameEvent.randomIntFromInterval(200,1000), this.store.playerFleet.spaceCredits);
                if(!amount){
                    gameState = GameState.states.space;
                    this.store.pastEvents.push({time:this.store.playerFleet.timeUnit, message:"We take some photos!","type":'warning'});
                    break;
                }
                this.store.playerFleet.spaceCredits -= amount;
                this.spaceCredits = -amount;
                
                item = Math.random() * refType.dialogs.length|0;
                newEvent.title = refType.dialogs[item].title;
                newEvent.description = refType.dialogs[item].description.replace('%s', amount);
                newEvent.actions = ['continue'];
                newEvent.after = function(event){
                    event.store.pastEvents.push({time:event.store.playerFleet.timeUnit, message:"Space Credits lost","type":'error'});
                    event.store.changeState(GameState.states.space);
                };
                break;
            case 'slow-down':
                item = Math.random() * refType.dialogs.length|0;
                newEvent.title = refType.dialogs[item].title;
                newEvent.description = refType.dialogs[item].description;
                newEvent.actions = ['continue'];
                newEvent.after = function(event){
                    event.store.playerFleet.speedEffectCounter = 25;
                    event.store.playerFleet.fleetSpeed = GameEvent.randomIntFromInterval(4,9);
                    event.store.playerFleet.updateStats(window.bvConfig.shipData);

                    event.store.pastEvents.push({time:event.store.playerFleet.timeUnit, message:"Fleet speed changed!","type":'info'});
                    event.store.changeState(GameState.states.space);
                };
                break;
            case 'speed-up':
                item = Math.random() * refType.dialogs.length|0;
                newEvent.title = refType.dialogs[item].title;
                newEvent.description = refType.dialogs[item].description;
                newEvent.actions = ['continue'];
                newEvent.after = function(event){
                    event.store.playerFleet.speedEffectCounter = 25;
                    event.store.playerFleet.fleetSpeed = GameEvent.randomIntFromInterval(11,16);
                    event.store.playerFleet.updateStats(window.bvConfig.shipData);

                    event.store.pastEvents.push({time:event.store.playerFleet.timeUnit, message:"Fleet speed changed!","type":'info'});
                    event.store.changeState(GameState.states.space);
                };
                break;

            case 'add-ships':

                item = Math.floor(Math.random() * GameEvent.validObtainableShipsArray.length);
                idx = GameEvent.validObtainableShipsArray[item];
                ship_type = GameEvent.validObtainableShips[idx];
                amount = GameEvent.randomIntFromInterval(ship_type.min,ship_type.max);
                if(!amount){
                    gameState = GameState.states.space;
                    this.store.pastEvents.push({time:this.store.playerFleet.timeUnit, message:"Small delay in our trip!","type":'warning'});
                    break;
                }
                this.store.playerFleet.shipChanges[GameEvent.validObtainableShipsArray[item]] = amount;
                
                item = Math.random() * refType.dialogs.length|0;
                newEvent.title = refType.dialogs[item].title;
                newEvent.description = refType.dialogs[item].description;
                newEvent.actions = ['take','skip'];
                newEvent.after = function(event,action){
                    event.store.pastEvents.push({time:event.store.playerFleet.timeUnit, message:"Ships found!","type":'success'});
                    switch(action){
                        case 'take':
                            event.store.playerFleet.updateShipAmountWithChanges(window.bvConfig.shipData);
                            event.store.changeState(GameState.states.space);
                            break;
                        case 'skip':
                        default:
                            event.validActions.skip = false;
                            event.validActions.take = false;
                            event.description = 'Decided to leave the ships behind!';
                            setTimeout(()=>{
                                event.store.changeState(GameState.states.space);
                            }, 2000);
                            break;
                    }
                };
                break;
            case 'remove-ships':
                item = Math.floor(Math.random() * GameEvent.validRemovableShipsArray.length);
                idx = GameEvent.validRemovableShipsArray[item];
                ship_type = GameEvent.validRemovableShips[idx];
                amount = Math.min(GameEvent.randomIntFromInterval(ship_type.min,ship_type.max), this.store.playerFleet.ships[idx]);
                if(idx=='210'){
                    amount--;
                }
                if(!amount){
                    gameState = GameState.states.space;
                    this.store.pastEvents.push({time:this.store.playerFleet.timeUnit, message:"Small delay in our trip!","type":'warning'});
                    break;
                }

                this.store.playerFleet.shipChanges[idx] = -amount;

                item = Math.random() * refType.dialogs.length|0;
                newEvent.title = refType.dialogs[item].title;
                newEvent.description = refType.dialogs[item].description;
                newEvent.actions = ['continue'];
                newEvent.after = function(event){
                    event.store.playerFleet.updateShipAmountWithChanges(window.bvConfig.shipData);
                    event.store.pastEvents.push({time:event.store.playerFleet.timeUnit, message:"We lost some ships","type":'error'});
                    event.store.changeState(GameState.states.space);
                };
                break;
            case 'supernova':
                if(this.store.playerFleet.ships['210']){
                    gameState = GameState.states.space;
                    this.store.pastEvents.push({time:this.store.playerFleet.timeUnit, message:"We detected a Star explosion and ran away!","type":'warning'});
                    break;
                }

                item = Math.random() * refType.dialogs.length|0;
                newEvent.title = refType.dialogs[item].title;
                newEvent.description = refType.dialogs[item].description+'. Survival chance: 80%';

                newEvent.actions = ['continue'];
                newEvent.after = function(event){
                  if(Math.random() > 0.8){
                      event.store.showEnding(GameState.endings.supernova);
                  } else {
                      //badge??
                      event.store.pastEvents.push({time:event.store.playerFleet.timeUnit, message:"We escaped from a Super Nova!","type":'success'});
                      event.validActions.continue = false;
                      event.description = 'We escaped from the Super nova!!';
                      setTimeout(()=>{
                          this.store.changeState(GameState.states.space);
                      }, 3000);
                  }
                };
                break;
            case 'black-hole':
                if(this.store.playerFleet.ships['210']){
                    gameState = GameState.states.space;
                    this.store.pastEvents.push({time:this.store.playerFleet.timeUnit, message:"We detected a Black Hole and ran way!","type":'warning'});
                    break;
                }

                item = Math.random() * refType.dialogs.length|0;
                newEvent.title = refType.dialogs[item].title;
                newEvent.description = refType.dialogs[item].description+'. Survival chance: 80%';

                newEvent.actions = ['continue'];
                newEvent.after = function(event){
                    if(Math.random() > 0.8){
                        event.store.showEnding(GameState.endings.blackHole);
                    } else {
                        event.store.pastEvents.push({time:event.store.playerFleet.timeUnit, message:"We escaped from a Black hole!","type":'success'});
                        event.validActions.continue = false;
                        event.description = 'We left the Black Hole behind!';
                        setTimeout(()=>{
                            this.store.changeState(GameState.states.space);
                        }, 3000);
                    }
                };
                break;
            case 'custom':
                newEvent.title = params.title;
                newEvent.description = params.description;
                newEvent.actions = params.actions;
                if(params.before){
                    newEvent.before = params.before;
                }
                newEvent.after = params.after; //Who will call after?
                break;
            default:
                console.log("Unknown type", eventType);
                gameState = GameState.states.space;
                break;
        }
        this.set(newEvent);
        return gameState;
    }
    
    @action set(event){
        this.title = event.title;
        this.type = event.type;
        this.description = event.description;
        
        if(event.before){
            event.before(this);
        }
        
        this.validActions.continue = false;
        this.validActions.take = false;
        this.validActions.skip = false;
        this.validActions.attack = false;
        this.validActions.flee = false;
        this.validActions.negotiate = false;
        this.validActions.return = false;
        for(let i=0;i<event.actions.length;i++){
            this.validActions[event.actions[i]] = true;
        }
        this.after = event.after;
    }

    @action trigger(action){
        this.after(this, action);
    }

    static getRandomEventId(store){
        const rn = Math.random();
        if(store.playerFleet.ships['211'] && rn < 0.1){
            return 'raid-planet';
        }
        
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
        if(rn < 0.90){ return 'battle'; }
        return 'nothing';
    }

    static randomIntFromInterval(min,max)
    {
        return Math.floor(Math.random()*(max-min+1)+min);
    }

    static getMaxProbableShipType(length, distance, maxDistance){

        return 1 + Math.min(Math.ceil(Math.sqrt( ((maxDistance - distance)/maxDistance)*100 )*length/10)+1, length);
    }
    
    static getMaxProbableShipTypeCount(distance, maxDistance){
        return Math.ceil(((maxDistance - distance)/maxDistance) * 10) + 1;
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
        enemy.name = GameEvent.enemyTypes[enemy.type].name;
        enemy.techs['109'] = GameEvent.randomIntFromInterval(
            GameEvent.enemyTypes[enemy.type].minTech,GameEvent.enemyTypes[enemy.type].maxTech);
        enemy.techs['110'] = GameEvent.randomIntFromInterval(
            GameEvent.enemyTypes[enemy.type].minTech,GameEvent.enemyTypes[enemy.type].maxTech);
        enemy.techs['111'] = GameEvent.randomIntFromInterval(
            GameEvent.enemyTypes[enemy.type].minTech,GameEvent.enemyTypes[enemy.type].maxTech);
        return enemy;
    }

    static getRandomShips(distance, maxDistance, type='battle'){
        let maxProbableShipType, pickableFleet;

        if(type=='battle'){
            maxProbableShipType = GameEvent.getMaxProbableShipType(Fleet.validEnemyShips.length, distance, maxDistance);
            pickableFleet = Fleet.validEnemyShips.slice(0, maxProbableShipType-1);
        } else {
            maxProbableShipType = GameEvent.getMaxProbableShipType(Fleet.validEnemyDefense.length, distance, maxDistance);
            pickableFleet = Fleet.validEnemyDefense.slice(0, maxProbableShipType-1);
        }

        const maxProbableShipTypeCount = GameEvent.getMaxProbableShipTypeCount(distance, maxDistance);
        const minProbableShipTypeCount = Math.max(maxProbableShipTypeCount/3, 1);
        const maxProbableShipTypeAmount = GameEvent.getMaxProbableShipAmount(distance, maxDistance);
        const minProbableShipTypeAmount = Math.max(maxProbableShipTypeAmount/5, 1);

        let realFleet = {}, idx, pos,
            max = GameEvent.randomIntFromInterval(minProbableShipTypeCount,maxProbableShipTypeCount)+1;
        for(let i=minProbableShipTypeCount; i < max; i++){
            pos = Math.random() * pickableFleet.length|0;
            idx = pickableFleet[pos];
            //console.log("id",idx);
            //console.log("res fleet",pickableFleet);
            //console.log("pos",pos);
            if(!realFleet[idx]){
                if(idx=='407' || idx=='408') {
                    realFleet[idx] = 1;
                } else {
                    realFleet[idx] = GameEvent.randomIntFromInterval(minProbableShipTypeAmount, maxProbableShipTypeAmount);
                }
            }
        }
        return realFleet;
    }
    
}

export default GameEvent;