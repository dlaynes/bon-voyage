import Fleet from './Fleet';
import GameState from './GameState';
import Planet from './Planet';

class LandMark {
    static defaultList = [
        {
            distance: 100000,
            visited: false,
            action: function(store) {
                if(store.playerFleet.shipsExpanded['208'].amount) {
                    let data = {
                        title: 'Met a Civil Fleet',
                        type: 'custom',
                        description: 'Hi. We would like to trade your very useful Colony Ship for our Esp. Probe, model SR-070. It survived more than 100 battles',
                        actions: ['take', 'skip'],
                        after: function (store, event, action) {

                            event.validActions.take = false;
                            event.validActions.skip = false;

                            switch(action){
                                case 'take':
                                    let ships = {
                                        '208' : store.playerFleet.shipsExpanded['208'].amount - 1,
                                        '210' : store.playerFleet.shipsExpanded['210'].amount + 1
                                    };
                                    for(let idx in ships){
                                        if(!ships.hasOwnProperty(idx)) continue;

                                        store.playerFleet.updateShipAmountAndStats(
                                            idx,
                                            ships[idx],
                                            window.bvConfig.shipData
                                        );
                                    }
                                    store.playerFleet.techs['124']++;
                                    event.description =
                                        'We traded the ships. The probe came with a strange artifact that is being reviewed by our engineers';
                                    store.pastEvents.push({time:store.playerFleet.timeUnit,
                                        message:"Got a very special Esp. Probe","type":'info'});

                                    break;
                                case 'skip':
                                default:
                                    store.pastEvents.push({time:store.playerFleet.timeUnit,
                                        message:"Met a friendly caravan in the way","type":'info'});
                                    event.description = 'We rejected the proposal due to a lack of Colony Ships in the area';
                                    break;
                            }
                            setTimeout(function(){
                                store.changeState(GameState.states.space);
                            }, 5000);
                        }
                    };
                    let state = store.eventManager.init('custom', data);
                    return {state:state}
                }
            }
        },
        {
            distance: 76000,
            visited: false,
            action: function(store) {
                let onlyProbes = true;
                for(let i=0; i < Fleet.validShips.length; i++){
                    let idx = Fleet.validShips[i];

                    if( idx != 210 && store.playerFleet.shipsExpanded[idx].amount) {
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
            distance: 74200,
            visited: false,
            action: function(store) {
                return {state: GameState.states.planet, data: Planet.planets["onigiri"]};
            }
        },
        {
            distance: 25800,
            visited: false,
            action: function(store) {
                return {state: GameState.states.planet, data: Planet.planets["tau-wg"]};
            }
        },
        {
            distance: 5000,
            visited: false,
            action: function(store) {
                if(store.playerFleet.techs['124'] > 5) {
                    let data = {
                        title: 'Darth Vader found our Fleet',
                        description: 'Luke, please accept this Death Star, and together we will bring order to the galaxy',
                        actions: ['take','flee'],
                        after: function(store,event,action){
                            event.validActions.take = false;
                            event.validActions.flee = false;

                            switch(action){
                                case 'take':
                                    //event.store.playerFleet.spaceCredits = 0;
                                    store.playerFleet.updateShipAmountAndStats('214', 1, window.bvConfig.shipData);
                                    event.description = 'Darth Vader\'s ship was a Hologram. But... is that a moon?';
                                    store.pastEvents.push({time:store.playerFleet.timeUnit,
                                        message:"Darth Vader gave us a gift","type":'success'});
                                    break;
                                case 'flee':
                                default:
                                    event.description = 'Darth Vader realizes Luke is not with us, and then we flee!';
                                    store.pastEvents.push({time:store.playerFleet.timeUnit,
                                        message:"We escaped from Darth Vader!","type":'info'});
                                    break;
                            }
                            setTimeout(function(){
                                store.changeState(GameState.states.space);
                            }, 5000);

                        }
                    };
                    let state = store.eventManager.init('custom', data);
                    return {state:state}
                }
                return null;
            }
        },
        {
            distance: 3500,
            visited: false,
            action: function(store) {
                let onlyProbes = true;
                for(let i=0; i < Fleet.validShips.length; i++){
                    let idx = Fleet.validShips[i];

                    if( idx != 210 && store.playerFleet.shipsExpanded[idx].amount) {
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