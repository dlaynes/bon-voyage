import Timer from '../Timer';
import Group from './Group';
import RoundStatistics from './RoundStatistics';

class Battle {

    after = null;
    report = null;

    constructor(allyFleet, enemyFleet, priceList, rapidFire, after){
        this.timer = new Timer();
        this.timer.start("battle");
        this.timer.start("init");

        /* We initialize the groups */
        this.attGroup = new Group(allyFleet, priceList, rapidFire);
        this.dfGroup = new Group(enemyFleet, priceList, rapidFire);
        this.report = new RoundStatistics(this.attGroup, this.dfGroup);
    
        this.after = after;
        
        this.init( );
        /* We begin the battle */
        this.battle( );
    }

    init(){
        this.timer.start("expand_att");
        this.attGroup.expand();
        this.timer.end("expand_att");

        this.timer.start("expand_df");
        this.dfGroup.expand();
        this.timer.end("expand_df");

        //initial state of the battle
        this.report.init(); //Will give 0,0,0 in the attack statistics
        this.timer.end('init');
    };

    battle(){

        let self = this, exitRounds, round = 1;

        while(1){
            if(!this.attGroup.expandedFleet.length){
                //console.log("Attackers do not have operational ships, in round "+round);
                exitRounds = true;
            }
            if(!this.dfGroup.expandedFleet.length){
                //console.log("Defenders do not have operational ships, in round "+round);
                exitRounds = true;
            }
            if(exitRounds){
                break;
            }

            /* TODO: check if both attacking groups are too weak to damage each other */

            //attack loop
            self.timer.start("battle_round_"+round); //Timer start
            //Attackers attack defenders. Defenders attack attackers :)
            self.attGroup.attack(self.dfGroup, self.attstats);
            self.dfGroup.attack(self.attGroup, self.dfstats);
            self.timer.end("battle_round_"+round); //Timer end

            //clean loop
            self.timer.start("battle_clean_"+round);
            self.attGroup.clean(); //remove destroyed ships
            self.dfGroup.clean();
            self.timer.end("battle_clean_"+round);

            //build report for this round
            self.report.update(round);

            round++;
            if(round > 6){
                break;
            }
        }

        this.timer.end("battle");
        this.timer.buildResults();

        if(this.after){
            this.after(this.timer.records, this.report.results);
        }
    };
    

}
export default Battle;