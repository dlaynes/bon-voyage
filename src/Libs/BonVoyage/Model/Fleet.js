import { observable, action, computed } from 'mobx';

class Fleet {

    static unitLimit = 999;

    static allBattleFleet = [202,203,204,205,206,207,208,209,210,211,213,214,215,401,402,403,404,405,406,407,408];
    static allFleet = [202,203,204,205,206,207,208,209,210,211,213,214,215,401,402,403,404,405,406,407,408,502,503];
    static validResearchLabTechs = [109,110,111,115,117,118];
    static validTechs = [109,110,111,115,117,118,124];

    static validShips = [202,203,204,205,206,207,208,209,210,211,213,214,215];
    static validEnemyShips = [210,204,205,202,206,207,211,203,215,213]; //Sorted
    static validEnemyDefense = [401,402,403,405,407,404,408,406]; //Sorted
    static validConstructibleShips = [202,203,204,205,206,207,208,209,210,211,213,215];

    shipsExpanded = {
        @observable '202':{amount:0,changes:0}, //light cargo
        @observable '203':{amount:0,changes:0}, //large cargo
        @observable '204':{amount:0,changes:0}, //light fighter
        @observable '205':{amount:0,changes:0}, //heavy fighter
        @observable '206':{amount:0,changes:0}, //Cruiser
        @observable '207':{amount:0,changes:0}, //Battleship
        @observable '208':{amount:0,changes:0}, //Colony ship
        @observable '209':{amount:0,changes:0}, //Recycler
        @observable '210':{amount:0,changes:0}, //Espionage Probe
        @observable '211':{amount:0,changes:0}, //Bomber
        @observable '213':{amount:0,changes:0}, //Destroyer
        @observable '214':{amount:0,changes:0}, //Death star
        @observable '215':{amount:0,changes:0}, //Battle cruiser
        @observable '401':{amount:0,changes:0}, //rocket launcher
        @observable '402':{amount:0,changes:0}, //Light laser
        @observable '403':{amount:0,changes:0}, //heavy laser
        @observable '404':{amount:0,changes:0}, //Gauss Cannon
        @observable '405':{amount:0,changes:0}, //Ion Cannon
        @observable '406':{amount:0,changes:0}, //Plasma Turret
        @observable '407':{amount:0,changes:0}, //Small shield Dome
        @observable '408':{amount:0,changes:0}, //Large Shield Dome
        @observable '502':{amount:0,changes:0}, //Anti Ballistic Missiles
        @observable '503':{amount:0,changes:0} //Interplanetary Missiles
    };

    @observable techs = {
        '109' : 0, //Mil
        '110' : 0, //Shield
        '111' : 0, //Armor
        '115' : 0, //Combustion Drive
        '117' : 0, //Impulse Drive
        '118' : 0, //Hyperspace Drive
        '124' : 0 //Astrophysics
    };

    count = 0;

    @observable capacity = 0;
    
    @computed get shipCount(){
        let c = 0;
        for(var i=0; i < Fleet.validShips.length;i++){
            c += this.shipsExpanded[Fleet.validShips[i]].amount;
        }
        return c;
    }

    @action assignTechs(techs){
        for(let tech in techs){
            if(!techs.hasOwnProperty(tech)){ continue; }
            this.techs[tech] = techs[tech];
        }
    }

    @action setShipAmount(idx, amount){
        if(idx in this.shipsExpanded){
            this.shipsExpanded[idx].amount = amount;
        }
    }

    @action resetShipChanges(){
        let amount = 0;
        for(let i=0; i < Fleet.allFleet.length; i++) {
            const idx = Fleet.allFleet[i];
            this.shipsExpanded[idx].changes = amount;
        }
    }

    @action resetShips(){
        for(let i=0; i < Fleet.allFleet.length; i++) {
            const idx = Fleet.allFleet[i];
            this.shipsExpanded[idx].amount = 0;
        }
    }

    static calcCapacity(rawShips){
        var capacity = 0;
        for(let i=0; i < Fleet.allFleet.length; i++) {
            const idx = Fleet.allFleet[i];
            if(window.bvConfig.shipData[idx].capacity && rawShips[idx]){
                capacity += window.bvConfig.shipData[idx].capacity * rawShips[idx];
            }
        }
        return capacity;
    }
}

export default Fleet;