import { observable, action } from 'mobx';

import GameState from './GameState';
import BattleManager from '../BattleManager';

export default class Event {

    @observable title = '';
    @observable type = 'nothing';

    @observable metal = 0;
    @observable crystal = 0;
    @observable deuterium = 0;
    @observable spaceCredits = 0;

    validActions = {
        @observable continue : false,
        @observable take : false,
        @observable skip : false,
        @observable attack : false,
        @observable flee : false,
        @observable negotiate : false,
        @observable return : false
    };
    
    @action resetActions(){
        this.validActions.continue = false;
        this.validActions.take = false;
        this.validActions.skip = false;
        this.validActions.attack = false;
        this.validActions.flee = false;
        this.validActions.negotiate = false;
        this.validActions.return = false;
    }

    @action enableActions(actions){
        let itAction;
        for(let i=0; i < actions.length; i++){
            itAction = actions[i];
            this.validActions[itAction] = true;
        }
    }

    /* Trigger these actions */
    
    @action static nothingAction(store, event, action){
        store.pastEvents.push(
            {time: store.playerFleet.timeUnit, message:"Something happened in the way",type:'info'}
        );
        store.changeState(GameState.states.space);
    }

    @action static raidPlanetAction(store, event, action) {

        event.validActions.attack = false;
        event.validActions.flee = false;
        switch (action) {
            case 'attack':
                Event.handleBattleEvent(store, action);
                break;
            case 'flee':
                Event.handleFleeEvent(store, null);
                break;
        }
    }

    @action static battleAction(store, event, action){
        event.validActions.attack = false;
        event.validActions.flee = false;
        switch(action){
            case 'attack':
                Event.handleBattleEvent(store, action);
                break;
            case 'flee':
                if(Math.random() > 0.5){
                    Event.handleFleeEvent(store, null);
                } else {
                    Event.handleBattleEvent(store, action);
                }
                break;
        }
    }
    
    @action static stealBattleAction(store, event, action){
        event.validActions.negotiate = false;
        event.validActions.attack = false;
        event.validActions.flee = false;

        switch(action){
            case 'negotiate':
                event.spaceCredits = 0;
                event.type = 'nothing';

                if(Math.random() > 0.5){
                    event[resource_name] = -event[resource_name];
                    event.description = 'They just left with our minerals!';
                } else {
                    store.storeResources();
                    event.description = 'We got our resources back! They\'ve just left';
                }
                store.pastEvents.push({
                    time: store.playerFleet.timeUnit,
                    message:"Found some thieves!", type:'warning'
                });
                setTimeout(() => {
                    store.changeState(GameState.states.space);
                }, 2000);
                break;
            case 'flee':
                if(Math.random() > 0.5){
                    Event.handleFleeEvent(store, resource_name, 'steal-battle');
                    break;
                } else {
                    Event.handleBattleEvent(store, action);
                }
                break;
            case 'attack':
            default:
                Event.handleBattleEvent(store, action);
                break;
        }
    }

    @action static addResourceAction(store, event, action){
        store.pastEvents.push(
            {time:store.playerFleet.timeUnit, message:"Resources sighted","type":'info'});
        switch(action){
            case 'take':
                store.storeResources();
                store.changeState(GameState.states.space);
                break;
            case 'skip':
            default:
                event.validActions.skip = false;
                event.validActions.take = false;
                event.description = 'We left the resources behind!';
                setTimeout(() => {
                    store.changeState(GameState.states.space);
                }, 2000);
                break;
        }
    }

    @action static resourcesLostAction(store){
        store.pastEvents.push({time:store.playerFleet.timeUnit, message:"Resources lost","type":'error'});
        store.changeState(GameState.states.space);
    }

    @action static spaceCreditsGainedAction(store){
        store.pastEvents.push({time:store.playerFleet.timeUnit, message:"Space Credits found!","type":'success'});
        store.changeState(GameState.states.space);
    }

    @action static spaceCreditsLostAction(store){
        store.pastEvents.push({time:store.playerFleet.timeUnit, message:"Space Credits lost","type":'error'});
        store.changeState(GameState.states.space);
    }

    @action static speedChangedAction(store){
        store.pastEvents.push({time:store.playerFleet.timeUnit, message:"Fleet speed changed!","type":'info'});
        store.changeState(GameState.states.space);
    }

    @action static addShipsAction(store, event){
        store.pastEvents.push({time:store.playerFleet.timeUnit, message:"Ships found!","type":'success'});
        switch(action){
            case 'take':
                store.playerFleet.updateShipAmountWithChanges(window.bvConfig.shipData);
                store.changeState(GameState.states.space);
                break;
            case 'skip':
            default:
                event.validActions.skip = false;
                event.validActions.take = false;
                event.description = 'Decided to leave the ships behind!';
                setTimeout(()=>{
                    store.changeState(GameState.states.space);
                }, 2000);
                break;
        }
    }

    @action static removeShipsAction(store, event){
        store.pastEvents.push({time:store.playerFleet.timeUnit, message:"We lost some ships","type":'error'});
        store.changeState(GameState.states.space);
    }

    @action static superNovaAction(store, event){
        if(Math.random() > 0.8){
            store.showEnding(GameState.endings.supernova);
        } else {
            //badge??
            store.pastEvents.push({time:store.playerFleet.timeUnit, message:"We escaped from a Super Nova!","type":'success'});
            event.validActions.continue = false;
            event.description = 'We escaped from the Super nova!!';
            setTimeout(()=>{
                store.changeState(GameState.states.space);
            }, 3000);
        }
    }

    @action static blackHoleAction(store, event){
        if(Math.random() > 0.8){
            store.showEnding(GameState.endings.blackHole);
        } else {
            store.pastEvents.push({time:store.playerFleet.timeUnit, message:"We escaped from a Black hole!","type":'success'});
            event.validActions.continue = false;
            event.description = 'We left the Black Hole behind!';
            setTimeout(()=>{
                store.changeState(GameState.states.space);
            }, 3000);
        }
    }


    /* Helpers */

    @action static handleBattleEvent(store, choice){
        store.battleManager.init((result) => {
            let event = store.currentEvent;
            switch (result) {
                case BattleManager.WIN:
                    store.storeResources();
                    if(choice=='attack'){
                        event.description = 'We won the battle and earned '+event.spaceCredits+' Credits';
                    } else if(event.type=='raid-planet') {
                        event.description = 'We won the battle and earned '+event.spaceCredits+' Credits';
                    } else {
                        event.description = 'We couldn\'t escape, but we won the battle and earned '+event.spaceCredits+' Credits';
                    }
                    setTimeout(() => {
                        store.playerFleet.applyBattleResults();
                        if(event.type=='battle'){
                            store.pastEvents.push({
                                time: store.playerFleet.timeUnit,
                                message: "Defeated an enemy fleet!", type: 'success'
                            });
                        } else if(event.type=='raid-planet'){
                            store.pastEvents.push({
                                time: store.playerFleet.timeUnit,
                                message: "Raided an enemy planet", type: 'success'
                            });
                        } else {
                            this.store.pastEvents.push({
                                time: store.playerFleet.timeUnit,
                                message: "Defeated some thieves!", type: 'success'
                            });
                        }
                        store.changeState(GameState.states.space);
                    }, 5000);
                    break;
                case BattleManager.LOST:
                    if(choice=='attack'){
                        event.description = 'We lost the battle...';
                    } else {
                        event.description = 'We couldn\'t escape. We lost the battle...';
                    }
                    setTimeout(() => {
                        store.showEnding(GameState.endings.noShips);
                    }, 5000);
                    break;
                case BattleManager.DRAW:
                    event.spaceCredits = 0;
                    store.storeResources();
                    if(choice=='attack'){
                        event.description = 'Draw battle!';
                    } else {
                        event.description = 'We couldn\'t escape. Draw battle!';
                    }
                    setTimeout( () => {
                        store.playerFleet.applyBattleResults();
                        if(event.type=='battle'){
                            store.pastEvents.push({
                                time: store.playerFleet.timeUnit,
                                message: "Found an enemy fleet!",
                                "type": 'warning'
                            });
                        } else {
                            store.pastEvents.push({
                                time: store.playerFleet.timeUnit,
                                message: "Found some thieves!",
                                "type": 'warning'
                            });
                        }
                        store.changeState(GameState.states.space);
                    }, 5000);
                    break;
                default:
                    console.log("Event error", result);
                    break;
            }
        });
    }

    @action static handleFleeEvent(store, resource_name){
        let event = store.currentEvent;
        event.spaceCredits = 0;

        let extraDesc = '??';

        if(resource_name){
            event[resource_name] = -event[resource_name];
            event.description = 'We left the resources behind!';
            extraDesc = 'Ran away from some thieves!';
        } else {
            if(event.type=='battle'){
                event.description = 'We ran away!';
                extraDesc = 'Ran away from a battle!';
            } else if(event.type=='raid-planet'){
                event.description = 'We decided not to attack for now';
                extraDesc = 'Enemy planet sighted';
            } else {

            }
        }
        store.pastEvents.push({time:store.playerFleet.timeUnit, message:extraDesc,"type":'warning'});
        setTimeout(() => {
            store.changeState(GameState.states.space);
        }, 2000);
    }


}