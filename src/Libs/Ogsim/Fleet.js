import Resource from './Resource';
import UnitType from './UnitType';
import Tools from '../Tools';

class Fleet {

    static resources = {};

    constructor(fleetUnits, pricelist, rapidfireConfig, military_tech, defense_tech, hull_tech, player_id){
        let amount, ft;

        this.player_id = player_id;
        //base technologies of the current fleet
        this.d = 1 + (military_tech * 0.1);
        this.s = 1+ (defense_tech * 0.1);
        this.h = (1 + (hull_tech * 0.1) ) * 0.1;

        this.unitTypes = {};
        //List of ships of the current fleet
        for(var id in fleetUnits){
            if(!fleetUnits.hasOwnProperty(id)){ continue; } //!!
            amount = fleetUnits[id];
            if(!Fleet.resources[id]){
                /* Small performance boost?? */
                Fleet.resources[id] = new Resource(pricelist[id], rapidfireConfig[id]);
            }
            ft = new UnitType(Fleet.resources[id], amount, this.d, this.s, this.h);
            this.unitTypes[id] = ft;
        }
    };

    expandTo(dataArray){
        let model, ut, apA = Tools.appendToArray;
        for( let id in this.unitTypes ){
            if(!this.unitTypes.hasOwnProperty(id)){ continue; }
            ut = this.unitTypes[id];

            //template of a ship
            model = [
                ut.h, //Ship Hull
                ut.s, //Ship shields, they are repaired after every turn
                ut //Unit type of the ship. (Object reference, good performance)
            ];
            //add the template to the global array list
            apA(dataArray, model, ut.m);
        }
    }

    compress(){
        var capacity = 0, data = {};

        for( let ut in this.unitTypes ){

        }

        return {
            "capacity": capacity,
            "fleet": data
        };
    }

    //TODO:
    buildReport(){

    }

    //status of the current fleet, after a round of shots
    getStats(){
        let res = [], item, ut;
        for( let id in this.unitTypes ){
            if(!this.unitTypes.hasOwnProperty(id)){ continue; }
            ut = this.unitTypes[id];
            item = {
                id: id, /* Unit type ID */
                difference: ut.m - ut.x, /* Remaining ships of this fleet's unit type, after a round */
                military_tech: ut.d, /* Attack, Defense and hull points */
                defense_tech: ut.s,
                hull_tech: ut.h
            };
            res.push(item);
        }
        return res;
    }


}

export default Fleet;