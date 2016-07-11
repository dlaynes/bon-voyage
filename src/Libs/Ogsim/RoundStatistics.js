class RoundStatistics {

    constructor(attackGroup, defenseGroup){
        this.results = [];
        this.attackGroup = attackGroup;
        this.defenseGroup = defenseGroup;
    }
    
    init(){
        this.update(0);
    }

    update(round){
        var ft,
            attCompressed = [],
            dfCompressed = [],
            i,
            stats;

        for(i=0; i < this.attackGroup.fleets.length; i++ ){
            ft = this.attackGroup.fleets[i];
            stats = ft.getStats();
            attCompressed.push( stats );
        }

        for(i=0; i < this.defenseGroup.fleets.length; i++ ){
            ft = this.defenseGroup.fleets[i];
            stats = ft.getStats();
            dfCompressed.push( stats );
        }

        this.results.push({
            "attack_fleet" : {
                "current": attCompressed,
                "attack_points": this.attackGroup.ap,
                "shield_defense": this.attackGroup.sp,
                "number_of_shoots" : this.attackGroup.sh
            },
            "defense_fleet" : {
                "current": dfCompressed,
                "attack_points": this.defenseGroup.ap,
                "shield_defense": this.defenseGroup.sp,
                "number_of_shoots" : this.defenseGroup.sh
            },
            "round" : round
        } ) ;
    }
}

export default RoundStatistics;