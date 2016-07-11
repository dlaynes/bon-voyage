import Fleet from './Model/Fleet';
import Battle from '../Ogsim/Battle';

class BattleManager {

    static WIN = 1;
    static DRAW = 2;
    static LOST = 3;

    allyFleet = null;
    enemyFleet = null;
    after = null;
    afterLosing = null;
    constructor(store){
        this.store = store;
    }
    
    setAllyFleet(allyFleet){
        this.allyFleet = allyFleet;
    }
    
    setEnemyFleet(enemyFleet){
        this.enemyFleet = enemyFleet;
    }

    init(after, afterLosing){
        let af = {}, ef = {}, idx;
        for(let i=0;i<Fleet.allBattleFleet.length;i++){
            idx = Fleet.allBattleFleet[i];
            if(this.allyFleet.ships[idx])
                af[idx+''] = this.allyFleet.ships[idx];
            if(this.enemyFleet.ships[idx])
                ef[idx+''] = this.enemyFleet.ships[idx];
        }
        let allyObj = {
            fleet: af,
            player_id: '1',
            military_tech: this.allyFleet.techs['109'],
            defense_tech: this.allyFleet.techs['110'],
            hull_tech: this.allyFleet.techs['111']
        };
        let enemyObj = {
            fleet: ef,
            player_id: '2',
            military_tech: this.enemyFleet.techs['109'],
            defense_tech: this.enemyFleet.techs['110'],
            hull_tech: this.enemyFleet.techs['111']
        };
        let PlayerList = {
            "1" : "Player",
            "2" : "PC"
        };

        //console.log("sending", allyObj.fleet, enemyObj.fleet);

        this.after = after;
        new Battle([allyObj], [enemyObj], window.bvConfig.shipData, window.bvConfig.rapidFire, this.expand );
    }
    
    expand = (stats, rounds) => {
        let latestRound = rounds.pop();
        let allyFleet = latestRound.attack_fleet.current[0];
        let enemyFleet = latestRound.defense_fleet.current[0],
            item;
        let current_explosions = 0, ally_difference = 0, enemy_difference = 0;

        //console.log('Ally fleet', allyFleet);
        for(let i=0; i<allyFleet.length; i++){
            item = allyFleet[i].id;
            current_explosions = (this.store.playerFleet.ships[item] - allyFleet[i].difference);

            this.store.playerFleet.shipChanges[item] = -current_explosions;
            ally_difference = allyFleet[i].difference;
        }
        //console.log('Enemy fleet', enemyFleet);
        for(let i=0; i<enemyFleet.length; i++){
            item = enemyFleet[i].id;
            current_explosions = (this.store.enemyFleet.ships[item] - enemyFleet[i].difference);

            this.store.enemyFleet.shipChanges[item] = -current_explosions;
            enemy_difference = enemyFleet[i].difference;
        }

        //Do something with wins - draws or loses
        if(ally_difference){
            if(enemy_difference){
                this.after(BattleManager.DRAW);
            } else {
                this.after(BattleManager.WIN);
            }
        } else {
            this.after(BattleManager.LOST);
        }
    };
}

export default BattleManager;