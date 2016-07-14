/* Just a container class for now */

class GameState {

    static states = {
        home : 1,
        ships : 2,
        space: 3,
        event : 4,
        battle : 5,
        planet: 6,
        badEnding: 7,
        goodEnding: 8
    };

    static endings = {
        success: 0,
        missingProbes: 1,
        noDeuterium: 2,
        noShips : 3,
        supernova : 4,
        blackHole : 5,
        quitGame: 6
    };
    
    static gameOverScreens = {
        '-1': {title:'Game Over',
            description:'You shouldn\'t be reading this message'},
        '0' : {title:'Game Over',description:'Game complete! Placeholder message!'},
        '1' : {title:'Fleet lost',
            description:'Some enemy aliens loved our Probes so much, they activated their Tractor Field weapon and stole them from us. Next time send a crewed fleet, with better gravity-deflection systems.'},
        '2' : {title:'Ran out of deuterium!',
            description:'The ships ran out of deuterium and went into power-saving mode. We will start hibernating soon and hopefully an expedition will rescue us in the next weeks, or else this could be a very long sleep.'},
        '3' : {title:'We lost our fleet',
            description:'There are no active ships right now. I\'m the only survivor, and just sent a message to the command center. I was put on hold, while a repetitive music plays as I wait.'},
        '4' : {title:'Supernova',
            description:'The expedition passed close to a giant star, which coincidentally exploded and destroyed the fleet, along with a part of the galaxy'},
        '5' : {title:'Black Hole',
            description:'The fleet entered a black hole, and turned into a bunch of metal made spaghetti, disappearing from this universe for an infinite time.'},
        '6' : {title:'Game Over',description:'Thanks for playing. Try again?'}
    };

}

export default GameState;