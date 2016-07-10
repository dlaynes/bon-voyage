import { observable, action, computed } from 'mobx';

import Resource from './Resource';

class Fleet {

    static unitLimit = 999;
    
    static allFleet = [202,203,204,205,206,207,208,209,210,211,213,214,215,401,402,403,404,405,406,407,408,502,503];
    static validMotors = [109,110,111];
    static validBattleTechs = [115,117,118];
    static validResearchLabTechs = [109,110,111,115,117,118];

    static validShips = [202,203,204,205,206,207,208,209,210,211,213,214,215];
    static validConstructibleShips = [202,203,204,205,206,207,208,209,210,211,213,215];

    @observable ships = {
        '202':0, //light cargo
        '203':0, //large cargo
        '204':0, //light fighter
        '205':0, //
        '206':0,
        '207':0,
        '208':0,
        '209':0,
        '210':0,
        '211':0,
        '213':0,
        '214':0, //Death star
        '215':0,  //Battle cruiser
        '401':0, //rocket launcher
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
    
    @computed get shipCount(){
        let c = 0;
        for(var i=0; i < Fleet.validShips.length;i++){
            c += this.ships[Fleet.validShips[i]];
        }
        return c;
    }

    @action assignTechs(techs){
        for(tech in techs){
            if(!techs.hasOwnProperty(tech)){ continue; }
            this.techs[tech] = techs[tech];
        }
    }

    @action resetShips(){
        for(let i=0; i < Fleet.allFleet.length; i++) {
            const idx = Fleet.allFleet[i];
            this.ships[idx] = 0;
        }
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