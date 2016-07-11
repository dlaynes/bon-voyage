import { observable, action } from 'mobx';

import GameState from './GameState';
import Fleet from './Fleet';
import Space from './Space';
import ExchangeRate from '../ExchangeRate';

class GameEvent {

    static EVENT_PROBABILITY = 0.15;
    
    static types = {
        'supernova': {
            probability: 0.01,
            dialogs: [{title:"Giant Star collapsing",description:"Will we be able to escape?"}]
        },
        'black-hole': {
            probability: 0.02,
            dialogs: [{title:"Black Hole",description:'Wrong coordinates!! Init evasion maneuvers!'}]
        },
        'remove-ships' : {
            probability: 0.06,
            dialogs: [{"title":"Ships lost","description":"Some ships were lost [TODO]"}]
        },
        'remove-space-credits': {
            probability: 0.12,
            dialogs: [{title:"We lost Space Credits",
                description:"Solar system limits. In order to continue we had to pay a toll of %s Space Credits to the Confederates"},
                {title:"We lost Space Credits",
                    description:"An Enemy Espionage Probe stole %s Space Credits from us, we were not able to track it."}]
        },
        'add-space-credits': {
            probability: 0.17,
            dialogs: [{"title":"Free Space Credits","description":"We found our lost wallet with %s Space Credits"}]
        },
        'remove-resource' : {
            probability: 0.22,
            dialogs: [{"title":"Lost some resources","description":"A deposit tank exploded, and we lost %s %t"}]
        },

        'add-ships' : {
            probability: 0.28,
            dialogs: [{"title":"New Ships!","description":"We found operational ships in a desert planet!"}]
        },
        'add-resource': {
            probability: 0.36,
            dialogs: [{"title":"Found some resources","description":"We found an asteroid with %s of %t, what should we do?"}]
        },
        'steal-battle': {
            probability: 0.44,
            dialogs: [{"title":"Battle","description":"We reached an enemy fleet of %c who stole %s %t from us!"}]
        },
        'slow-down': {
            probability: 0.52,
            dialogs: [{title:"Malfunction", description:"One of the motors of the main ship failed, this will slow down the mission for a while"}]
        },
        'speed-up': {
            probability: 0.6,
            dialogs: [{title:"Vortex", description: "A vortex trapped our fleet. Now it is moving at a higher speed!"}]
        },
        'battle': {
            probability: 0.9,
            dialogs: [{"title":"Battle","description":"We encountered a fleet of %c. It seems there is a reward available"}]
        },
        'nothing': {
            probability: 1,
            dialogs: [
                {"title":"Inhabited Planet","description":"We found a planet with weird living things. Amazing, nothing we have seen before."},
                {"title":"Space Nebula","description":"There is a shiny Nebula nearby, and we decided to take some photos"}]
        },
        'custom': {
            probability: 2,
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
        after : function(event,action){
            event.store.changeState(GameState.states.space);
        }
    };

    static validEventResources = ['metal','crystal','deuterium'];
    static validRemovableShipsArray = [202,203,204,205,206,210];
    static validRemovableShips = {
        '202':{min:1,max:5},
        '203':{min:1,max:2},
        '204':{min:1,max:5},
        '205':{min:1,max:2},
        '206':{min:1,max:1},
        '207':{min:1,max:1},
        '210':{min:1,max:10}
    };
    static validObtainableShipsArray = [202,203,204,205,206,210,215];
    static validObtainableShips = {
        '202':{min:1,max:10},
        '203':{min:1,max:4},
        '204':{min:1,max:10},
        '205':{min:1,max:4},
        '206':{min:1,max:2},
        '207':{min:1,max:1},
        '210':{min:1,max:20},
        '215':{min:1,max:1}
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
            rewardValue,
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
                newEvent.after = function(event,action){
                    event.store.pastEvents.push({time:event.store.playerFleet.timeUnit, message:"Found something in the way","type":'info'});
                    event.store.changeState(GameState.states.space);
                };
                break;
            case 'battle':
                this.store.enemyFleet.resetShips();

                priceList = window.bvConfig.shipData;

                ships = GameEvent.getRandomShips(this.store.playerFleet.distance, Space.defaultDistance);
                enemy = GameEvent.getRandomEnemy();
                rewardValue = 0;
                resources = {metal:0,crystal:0,deuterium:0};

                for(let idx in ships){
                    if(!ships.hasOwnProperty(idx)) continue;

                    resources.metal = ships[idx] * priceList[idx].metal;
                    resources.crystal = ships[idx] * priceList[idx].crystal;
                    resources.deuterium = ships[idx] * priceList[idx].deuterium;

                    this.store.enemyFleet.ships[idx] = ships[idx];
                    rewardValue += ExchangeRate.resourcesToSpaceCredits(resources, ExchangeRate.NORMAL) / 3;
                }
                this.store.enemyFleet.assignTechs(enemy.techs);
                this.spaceCredits = rewardValue|0;

                item = Math.random() * refType.dialogs.length|0;
                newEvent.title = refType.dialogs[item].title;
                newEvent.description = (refType.dialogs[item].description.replace('%', enemy.name));
                newEvent.actions = ['attack','flee','negotiate'];
                newEvent.after = function(event,action){
                    event.store.pastEvents.push({time:event.store.playerFleet.timeUnit, message:"Found an enemy fleet","type":'warning'});
                    event.store.changeState(GameState.states.space);
                };
                break;
            case 'steal-battle':
                this.store.enemyFleet.resetShips();

                priceList = window.bvConfig.shipData;

                ships = GameEvent.getRandomShips(this.store.playerFleet.distance, Space.defaultDistance);
                enemy = GameEvent.getRandomEnemy();
                rewardValue = 0;
                resources = {metal:0,crystal:0,deuterium:0};

                for(let idx in ships){
                    if(!ships.hasOwnProperty(idx)) continue;

                    resources.metal = ships[idx] * priceList[idx].metal;
                    resources.crystal = ships[idx] * priceList[idx].crystal;
                    resources.deuterium = ships[idx] * priceList[idx].deuterium;

                    this.store.enemyFleet.ships[idx] = ships[idx];
                    rewardValue += ExchangeRate.resourcesToSpaceCredits(resources, ExchangeRate.NORMAL) / 3;
                }
                this.store.enemyFleet.assignTechs(enemy.techs);
                this.spaceCredits = rewardValue|0;

                item = Math.random() * refType.dialogs.length|0;
                newEvent.title = refType.dialogs[item].title;
                newEvent.description = (refType.dialogs[item].description.replace('%', enemy.name));
                newEvent.actions = ['attack','flee','negotiate'];
                newEvent.after = function(event,action){
                    event.store.pastEvents.push({time:event.store.playerFleet.timeUnit, message:"Found some thieves!","type":'warning'});
                    event.store.changeState(GameState.states.space);
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
                            event.store.playerFleet.setResources({
                                metal: event.store.playerFleet.metal + event.metal,
                                crystal: event.store.playerFleet.crystal + event.crystal,
                                deuterium: event.store.playerFleet.deuterium + event.deuterium
                            });
                            event.store.changeState(GameState.states.space);
                            break;
                        case 'skip':
                        default:
                            event.validActions.continue = false;
                            event.description = 'Decided to leave the resources behind!';
                            setTimeout(()=>{
                                event.store.changeState(GameState.states.space);
                            }, 2000);
                            break;
                    }
                };

                break;
            case 'remove-resource':
                item = Math.floor(Math.random() * 3);
                resource_name = GameEvent.validEventResources[item];
                amount = Math.min(GameEvent.randomIntFromInterval(1000,10000), this.store.playerFleet[resource_name]);
                if(!amount){
                    gameState = GameState.states.space;
                    this.store.pastEvents.push({time:this.store.playerFleet.timeUnit, message:"Small delay in our trip!","type":'warning'});
                    break;
                }
                this.store.playerFleet[resource_name] -= amount;

                this[resource_name] = -amount;
                item = Math.random() * refType.dialogs.length|0;
                newEvent.title = refType.dialogs[item].title;
                newEvent.description = (refType.dialogs[item].description
                                            .replace('%s', amount)).replace('%t', resource_name);
                newEvent.actions = ['continue'];
                newEvent.after = function(event,action){
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
                newEvent.after = function(event,action){
                    event.store.pastEvents.push({time:event.store.playerFleet.timeUnit, message:"Space Credits found!","type":'success'});
                    event.store.changeState(GameState.states.space);
                };
                break;
            case 'remove-space-credits':
                amount = Math.min(GameEvent.randomIntFromInterval(200,1000), this.store.playerFleet.spaceCredits);
                if(!amount){
                    gameState = GameState.states.space;
                    this.store.pastEvents.push({time:this.store.playerFleet.timeUnit, message:"Small delay in our trip!","type":'warning'});
                    break;
                }
                this.store.playerFleet.spaceCredits -= amount;
                this.spaceCredits = -amount;
                
                item = Math.random() * refType.dialogs.length|0;
                newEvent.title = refType.dialogs[item].title;
                newEvent.description = refType.dialogs[item].description.replace('%s', amount);
                newEvent.actions = ['continue'];
                newEvent.after = function(event,action){
                    event.store.pastEvents.push({time:event.store.playerFleet.timeUnit, message:"Space Credits lost","type":'error'});
                    event.store.changeState(GameState.states.space);
                };
                break;
            case 'slow-down':
                item = Math.random() * refType.dialogs.length|0;
                newEvent.title = refType.dialogs[item].title;
                newEvent.description = refType.dialogs[item].description;
                newEvent.actions = ['continue'];
                newEvent.after = function(event,action){
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
                newEvent.after = function(event,action){
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
                            for(let i=0; i < Fleet.allFleet.length; i++) {
                                const idx = Fleet.allFleet[i];

                                this.store.playerFleet.ships[idx] += this.store.playerFleet.shipChanges[idx];
                                this.store.playerFleet.shipChanges[idx] = 0;
                            }
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
                idx = GameEvent.validObtainableShipsArray[item];
                ship_type = GameEvent.validRemovableShips[idx];
                amount = Math.min(GameEvent.randomIntFromInterval(ship_type.min,ship_type.max), this.store.playerFleet.ships[item]);
                if(!amount){
                    gameState = GameState.states.space;
                    this.store.pastEvents.push({time:this.store.playerFleet.timeUnit, message:"Small delay in our trip!","type":'warning'});
                    break;
                }
                this.store.playerFleet.shipChanges[GameEvent.validObtainableShipsArray[item]] = -amount;

                item = Math.random() * refType.dialogs.length|0;
                newEvent.title = refType.dialogs[item].title;
                newEvent.description = refType.dialogs[item].description;
                newEvent.actions = ['continue'];
                newEvent.after = function(event,action){
                    for(let i=0; i < Fleet.allFleet.length; i++) {
                        const idx = Fleet.allFleet[i];

                        this.store.playerFleet.ships[idx] += this.store.playerFleet.shipChanges[idx];
                        this.store.playerFleet.shipChanges[idx] = 0;
                    }

                    event.store.pastEvents.push({time:event.store.playerFleet.timeUnit, message:"We lost some ships","type":'error'});
                    event.store.changeState(GameState.states.space);
                };
                break;
            case 'supernova':
                item = Math.random() * refType.dialogs.length|0;
                newEvent.title = refType.dialogs[item].title;
                newEvent.description = refType.dialogs[item].description;

                newEvent.actions = ['continue'];
                newEvent.after = function(event,action){
                  if(Math.random() > 0.5){
                      this.store.showEnding(GameState.endings.supernova);
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
            case 'blackhole':
                newEvent.title = 'Black Hole';
                newEvent.description = 'Wrong coordinates!! Init evasion maneuvers!';
                newEvent.actions = ['continue'];
                newEvent.after = function(event,action){
                    if(Math.random() > 0.5){
                        this.store.showEnding(GameState.endings.blackHole);
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
                    params.before(this);
                }
                newEvent.after = after; //Who will call after?
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
        
        this.params = event.params;
        
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

    static randomIntFromInterval(min,max)
    {
        return Math.floor(Math.random()*(max-min+1)+min);
    }

    static getMaxProbableShipType(distance, maxDistance){
        const length = Fleet.validEnemyShips.length;

        return Math.min(Math.ceil(Math.sqrt( (1 - (maxDistance - distance)/maxDistance)*100 )*length/10), length);
    }
    
    static getMaxProbableShipTypeCount(distance, maxDistance){
        return Math.ceil((1 - (maxDistance - distance)/maxDistance) * 10) + 1;
    }

    static getMaxProbableShipAmount(distance, maxDistance){
        return Math.ceil((1 - (maxDistance - distance)/maxDistance) * 20) + 10;
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

    static getRandomShips(distance, maxDistance){
        const maxProbableShipType = GameEvent.getMaxProbableShipType(distance, maxDistance);

        const maxProbableShipTypeCount = GameEvent.getMaxProbableShipTypeCount(distance, maxDistance);
        const minProbableShipTypeCount = Math.max(maxProbableShipTypeCount/3, 1);
        const maxProbableShipTypeAmount = GameEvent.getMaxProbableShipAmount(distance, maxDistance);
        const minProbableShipTypeAmount = Math.max(maxProbableShipTypeAmount/3, 1);

        let pickableFleet = Fleet.validEnemyShips.slice(0, maxProbableShipType-1);
        let realFleet = {}, idx, pos,
            max = GameEvent.randomIntFromInterval(minProbableShipTypeCount,maxProbableShipTypeCount)+1;
        for(let i=minProbableShipTypeCount; i < max; i++){
            pos = Math.random() * pickableFleet.length|0;
            idx = pickableFleet[pos];
            if(!realFleet[idx]){
                realFleet[idx] = GameEvent.randomIntFromInterval(minProbableShipTypeAmount, maxProbableShipTypeAmount);
            }
        }
        return realFleet;
    }
    
}

export default GameEvent;