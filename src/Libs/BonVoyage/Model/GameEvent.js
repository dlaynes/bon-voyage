import { observable, action } from 'mobx';

class GameEvent {

    static EVENT_PROBABILITY = 0.15;
    
    static types = {
        'nothing': {

        },
        'add-resource' : {

        },
        'remove-resource': {

        },
        'add-space-credits': {

        },
        'remove-space-credits': {

        },
        'add-ships' : {

        },
        'remove-ships' : {

        },
        'battle': {
            
        },
        'supernova': {
            
        },
        'black-hole': {
            
        },
        'custom': {
            
        }
    };
    
    static validActions = ['continue','take','skip','attack','flee','negotiate','return'];

    static defaultEvent = {
        title: 'Event',
        type: 'nothing',
        description: 'Nothing interesting',
        resourceAmount: 0,
        actions: {'continue': () => {} },
        metal: 0,
        crystal: 0,
        deuterium: 0,
        spaceCredits: 0
    };
    
    @observable title = '';
    @observable type = 'nothing';
    
    @observable metal = 0;
    @observable crystal = 0;
    @observable deuterium = 0;
    @observable spaceCredits = 0;
    
    constructor(){
        
    }
    
    set(event){
        this.title = event.title;
        this.type = event.type;
        this.description = event.description;
        this.resourceAmount = event.resourceAmount;
        this.actions = event.actions;
        this.metal = event.metal;
        this.crystal = event.crystal;
        this.deuterium = event.deuterium;
        this.spaceCredits = event.spaceCredits;
    }
    
}

export default GameEvent;