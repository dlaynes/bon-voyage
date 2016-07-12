import Fleet from './Fleet';
import GameState from './GameState';
import GameEvent from './GameEvent';
import Planet from './Planet';

class LandMark {
    static defaultList = [
        {
            distance: 100000,
            visited: false,
            action: function(store) {
                if(store.playerFleet.ships['208']) {
                    let data = {
                        title: 'Met a Civil Fleet',
                        type: 'custom',
                        description: 'Hi. We would like to trade your very useful Colony Ship for our lucky Esp. Probe, which survived more than 100 battles',
                        actions: ['take', 'skip'],
                        after: function (event, action) {

                            event.validActions.take = false;
                            event.validActions.skip = false;

                            switch(action){
                                case 'take':
                                    let ships = {
                                        '208' : event.store.playerFleet.ships['208'] -= 1,
                                        '210' : event.store.playerFleet.ships['210'] += 1
                                    };
                                    for(let idx in ships){
                                        if(!ships.hasOwnProperty(idx)) continue;

                                        event.store.playerFleet.updateShipAmountAndStats(
                                            idx,
                                            ships[idx],
                                            window.bvConfig.shipData
                                        );
                                    }
                                    event.store.playerFleet.techs['124']++;
                                    event.description =
                                        'We just traded the ships. The probe came with a strange artifact that is being reviewed by our engineers';
                                    break;
                                case 'skip':
                                default:
                                        event.description = 'We rejected the proposal due to a lack of Colony Ships in the area';
                                    break;
                            }
                            setTimeout(function(){
                                event.store.changeState(GameState.states.space);
                            }, 5000);
                        }
                    };
                    let state = store.currentEvent.init('custom', data);
                    return {state:state}
                }
            }
        },
        {
            distance: 81000,
            visited: false,
            action: function(store) {
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
            action: function(store) {
                return {state: GameState.states.planet, data: Planet.planets["v-3455"]};
            }
        },
        {
            distance: 38500,
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
                        after: function(event,action){
                            event.validActions.take = false;
                            event.validActions.flee = false;

                            switch(action){
                                case 'take':
                                    //event.store.playerFleet.spaceCredits = 0;
                                    event.store.playerFleet.updateShipAmountAndStats('214', 1, window.bvConfig.shipData);
                                    event.description = 'Darth Vader\'s ship was an Hologram. But... is that a moon?';
                                    event.store.pastEvents.push({time:event.store.playerFleet.timeUnit,
                                        message:"Darth Vader gave us something","type":'success'});
                                    break;
                                case 'flee':
                                default:
                                    event.description = 'Darth Vader realizes Luke is not with us, and then we flee!';
                                    event.store.pastEvents.push({time:event.store.playerFleet.timeUnit,
                                        message:"We escaped from Darth Vader!","type":'info'});
                                    break;
                            }
                            setTimeout(function(){
                                event.store.changeState(GameState.states.space);
                            }, 5000);

                        }
                    };
                    let state = store.currentEvent.init('custom', data);
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