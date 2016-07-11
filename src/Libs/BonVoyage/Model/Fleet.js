import { observable, action, computed } from 'mobx';

import Resource from './Resource';

class Fleet {

    static unitLimit = 999;

    static allBattleFleet = [202,203,204,205,206,207,208,209,210,211,213,214,215,401,402,403,404,405,406,407,408];
    static allFleet = [202,203,204,205,206,207,208,209,210,211,213,214,215,401,402,403,404,405,406,407,408,502,503];
    static validMotors = [109,110,111];
    static validBattleTechs = [115,117,118];
    static validResearchLabTechs = [109,110,111,115,117,118];

    static validShips = [202,203,204,205,206,207,208,209,210,211,213,214,215];
    static validEnemyShips = [210,204,205,206,207,211,215,213];
    static validConstructibleShips = [202,203,204,205,206,207,208,209,210,211,213,215];

    @observable ships = {
        '202':0, //light cargo
        '203':0, //large cargo
        '204':0, //light fighter
        '205':0, //heavy fighter
        '206':0, //Cruiser
        '207':0, //Battleship
        '208':0, //Colony ship
        '209':0, //Recycler
        '210':0, //Espionage Probe
        '211':0, //Bomber
        '213':0, //Destroyer
        '214':0, //Death star
        '215':0, //Battle cruiser
        '401':0, //rocket launcher
        '402':0, //Light laser
        '403':0, //heavy laser
        '404':0, //Gauss Cannon
        '405':0, //Ion Cannon
        '406':0, //Plasma Turret
        '407':0, //Small shield Dome
        '408':0, //Large Shield Dome
        '502':0, //Anti Ballistic Missiles
        '503':0 //Interplanetary Missiles
    };

    /* Ship Changes after an event or battle */
    @observable shipChanges = {
        '202':0,
        '203':0,
        '204':0,
        '205':0,
        '206':0,
        '207':0,
        '208':0,
        '209':0,
        '210':0,
        '211':0,
        '213':0,
        '214':0,
        '215':0,
        '401':0,
        '402':0,
        '403':0,
        '404':0,
        '405':0,
        '406':0,
        '407':0,
        '408':0,
        '502':0,
        '503':0
    };

    @observable techs = {
        '109' : 0,
        '110' : 0,
        '111' : 0,
        '115' : 0,
        '117' : 0,
        '118' : 0,
        '124' : 0
    };

    @observable capacity = 0;
    
    @computed get shipCount(){
        let c = 0;
        for(var i=0; i < Fleet.validShips.length;i++){
            c += this.ships[Fleet.validShips[i]];
        }
        return c;
    }

    @action assignTechs(techs){
        for(let tech in techs){
            if(!techs.hasOwnProperty(tech)){ continue; }
            this.techs[tech] = techs[tech];
        }
    }

    @action resetShipChanges(){
        for(let i=0; i < Fleet.allFleet.length; i++) {
            const idx = Fleet.allFleet[i];
            this.shipChanges[idx] = 0;
        }
    }

    @action resetShips(){
        for(let i=0; i < Fleet.allFleet.length; i++) {
            const idx = Fleet.allFleet[i];
            this.ships[idx] = 0;
        }
    }

    static calcCapacity(ships){
        var capacity = 0;
        for(let i=0; i < Fleet.allFleet.length; i++) {
            const idx = Fleet.allFleet[i];
            if(window.bvConfig.shipData[idx].capacity && ships[idx]){
                capacity += window.bvConfig.shipData[idx].capacity * ships[idx];
            }
        }
        return capacity;
    }

    static toDeuteriumPointsAll(){
        for(let i=0; i < Fleet.allFleet.length; i++) {
            const idx = Fleet.allFleet[i];
            this.ships[idx] = 0;
        }
    }

    static toSpaceCredits(){

    }
    
}

export default Fleet;