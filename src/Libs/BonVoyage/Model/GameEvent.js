class GameEvent {

    EVENT_PROBABILITY = 0.15;
    
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
    
    static actions = ['continue','take','skip','attack','flee','negotiate'];

    static defaultEvent = {
        title: 'Event',
        type: 'nothing',
        description: 'Nothing interesting',
        resourceTypeGained: 'metal',
        resourceTypeLost : 'metal',
        resourceAmount: 0,
        actions: ['continue']
    };
    
}

export default GameEvent;