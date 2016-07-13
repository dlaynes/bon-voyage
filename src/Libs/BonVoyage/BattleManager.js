import Fleet from './Model/Fleet';
import Battle from '../Ogsim/Battle';

class BattleManager {

    static WIN = 1;
    static DRAW = 2;
    static LOST = 3;

    allyFleet = null;
    enemyFleet = null;
    after = null;
    constructor(store){
        this.store = store;
    }
    
    setAllyFleet(allyFleet){
        this.allyFleet = allyFleet;
    }
    
    setEnemyFleet(enemyFleet){
        this.enemyFleet = enemyFleet;
    }

    init(after){
        let af = {}, ef = {}, idx;
        for(let i=0;i<Fleet.allBattleFleet.length;i++){
            idx = Fleet.allBattleFleet[i];
            if(this.allyFleet.shipsExpanded[idx].amount)
                af[idx+''] = this.allyFleet.shipsExpanded[idx].amount;
            if(this.enemyFleet.shipsExpanded[idx].amount)
                ef[idx+''] = this.enemyFleet.shipsExpanded[idx].amount;
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
        /*
        let PlayerList = {
            "1" : "Player",
            "2" : "PC"
        }; */

        this.after = after;
        new Battle([allyObj], [enemyObj], window.bvConfig.shipData, window.bvConfig.rapidFire, this.expand );
    }
    
    expand = (stats, rounds) => {
        let latestRound = rounds.pop();
        let allyFleet = latestRound.attack_fleet.current[0];
        let enemyFleet = latestRound.defense_fleet.current[0],
            item;
        let current_explosions = 0, ally_difference = 0, enemy_difference = 0;

        //Any survivors?
        for(let i=0; i<allyFleet.length; i++){
            item = allyFleet[i].id;
            current_explosions = (this.store.playerFleet.shipsExpanded[item].amount - allyFleet[i].difference);
            if(current_explosions){
                this.store.playerFleet.shipsExpanded[item].changes = -current_explosions;
            }
            ally_difference += allyFleet[i].difference;
        }

        for(let i=0; i<enemyFleet.length; i++){
            item = enemyFleet[i].id;
            current_explosions = (this.store.enemyFleet.shipsExpanded[item].amount - enemyFleet[i].difference);
            if(current_explosions){
                this.store.enemyFleet.shipsExpanded[item].changes = -current_explosions;
            }
            enemy_difference += enemyFleet[i].difference;
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