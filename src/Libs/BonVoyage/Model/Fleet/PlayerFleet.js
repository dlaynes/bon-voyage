import { observable, action, computed } from 'mobx';

import Fleet from '../Fleet';
import Space from '../Space';

class PlayerFleet extends Fleet {
    
    static defaultTechs = {
        '109' : 10, //Combustion Drive
        '110' : 8, //Impulse Drive
        '111' : 4, //Hyperspace Drive
        '115' : 10, //Military Tech
        '117' : 10, //Shielding Tech
        '118' : 10, //Armor Tech
        '124' : 4 //Astrophysics
    };

    static validPlayerTechs = [109,110,111,115,117,118,124];

    @observable metal = 0;
    @observable crystal = 0;
    @observable deuterium = 0;

    @observable spaceCredits = 0;

    @observable distance = 0;
    @observable speed = 0;
    @observable capacity = 0;
    @observable duration = 0.0;
    @observable consumption = 0;
    
    @observable fleetSpeed = 10;
    
    @observable timeUnit = 0;
    
    reset(){
        this.resetResources();
        this.resetTechs();
        this.resetVariables();
        this.resetShips();
    }
    
    @action resetVariables(){
        this.distance = Space.defaultDistance;
        this.speed = 0;
        this.duration = 0.0;
        this.capacity = 0;
        this.consumption = 0;
        this.timeUnit = 0;
        this.fleetSpeed = 10;
    }
    
    @action resetTechs(){
        for(let i=0; i < PlayerFleet.validPlayerTechs.length;i++) {
            let idx = PlayerFleet.validPlayerTechs[i];
            this.techs[idx] = PlayerFleet.defaultTechs[idx];
        }
    }
    
    @action resetResources(){
        this.metal = 0;
        this.crystal = 0;
        this.deuterium = 0;
        this.spaceCredits = 0;
    }
    
    @action addResources(resources){
        
    }
    
    @action setResources(resources){
        var spentResources = {metal: 0, crystal: 0, deuterium: 0};
        var remaining = this.capacity;

        if(remaining > resources.deuterium){
            remaining -= resources.deuterium;
            spentResources.deuterium = resources.deuterium;

            if(remaining > resources.metal){
                remaining -= resources.metal;
                spentResources.metal = resources.metal;

                if(remaining > resources.crystal){
                    //We don't have to substract anymore
                    spentResources.crystal = resources.crystal;
                } else {
                    spentResources.crystal = remaining;
                }
            } else {
                spentResources.metal = remaining;
            }
        } else {
            spentResources.deuterium = remaining;
        }
        this.metal = spentResources.metal;
        this.crystal = spentResources.crystal;
        this.deuterium = spentResources.deuterium;

        return spentResources;
    }

    @action updateShipAmountAndStats(idx, amount, priceList){
        if(idx in this.ships){
            this.ships[idx] = amount;
        } else {
            console.warn("Ship not found", idx);
            return;
        }

        let slowest = 9999999999,
            consumption = 0,
            capacity = 0,
            combustionDriveTech = this.techs['115'],
            impulseDriveTech = this.techs['117'],
            hyperspaceDriveTech = this.techs['118'],
            shipListExtra = {},
            distance = Space.minDistance;

        for(let i=0; i < Fleet.validShips.length;i++){

            let idx = Fleet.validShips[i];
            if(!this.ships[idx]){
                continue;
            }

            let new_speed = null,
                new_consumption = null,
                motor3 = priceList['motor3'],
                motor2 = priceList['motor2'];

            if(typeof motor3 !== undefined){
                for(let motor in motor3) {
                    if (!motor3.hasOwnProperty(motor)) continue;
                    switch(motor){
                        case '115':
                            if(combustionDriveTech > motor3[motor]){
                                new_speed = PlayerFleet.calcSpeed(combustionDriveTech, priceList.speed3, 1);
                                new_consumption = priceList.consumption3;
                            }
                            break;
                        case '117':
                            if(impulseDriveTech > motor3[motor]){
                                new_speed = PlayerFleet.calcSpeed(impulseDriveTech, priceList.speed3, 2);
                                new_consumption = priceList.consumption3;
                            }
                            break;
                        case '118':
                            if(hyperspaceDriveTech > motor3[motor]){
                                new_speed = PlayerFleet.calcSpeed(hyperspaceDriveTech, priceList.speed3, 3);
                                new_consumption = priceList.consumption3;
                            }
                            break;
                        default:
                            break;
                    }
                }
            }
            if(typeof motor2 !== undefined && !new_speed){
                for(let motor in motor2){
                    if (!motor2.hasOwnProperty(motor)) continue;
                    switch(motor){
                        case '115':
                            if(combustionDriveTech > motor2[motor]){
                                new_speed = PlayerFleet.calcSpeed(combustionDriveTech, priceList.speed2, 1);
                                new_consumption = priceList.consumption2;
                            }
                            break;
                        case '117':
                            if(impulseDriveTech > motor2[motor]){
                                new_speed = PlayerFleet.calcSpeed(impulseDriveTech, priceList.speed2, 2);
                                new_consumption = priceList.consumption2;
                            }
                            break;
                        case '118':
                            if(hyperspaceDriveTech > motor2[motor]){
                                new_speed = PlayerFleet.calcSpeed(hyperspaceDriveTech, priceList.speed2, 3);
                                new_consumption = priceList.consumption2;
                            }
                            break;
                        default:
                            break;
                    }
                }
            }
            if(!new_speed){
                switch(priceList['motor']){
                    case 115:
                        new_speed = PlayerFleet.calcSpeed(combustionDriveTech, priceList.speed, 1);
                        new_consumption = priceList.consumption;
                        break;
                    case 117:
                        new_speed = PlayerFleet.calcSpeed(impulseDriveTech, priceList.speed, 2);
                        new_consumption = priceList.consumption;
                        break;
                    case 118:
                        new_speed = PlayerFleet.calcSpeed(hyperspaceDriveTech, priceList.speed, 3);
                        new_consumption = priceList.consumption;
                        break;
                    default:
                        break;
                }
            }

            capacity += this.ships[idx] * priceList.capacity;
            slowest = Math.min(new_speed, slowest);
            shipListExtra[idx] = {speed: new_speed, consumption: new_consumption};
        }

        this.capacity = capacity;

        let duration = 10 + 35000/this.fleetSpeed * Math.sqrt((10*distance) / slowest ), sum = 0;

        for(let i=0; i < Fleet.validShips.length;i++) {
            let idx = Fleet.validShips[i];
            if (this.ships[idx]) {
                sum += this.ships[idx];
                consumption += PlayerFleet.calcConsumption(distance, duration,
                    shipListExtra[idx].speed, this.ships[idx], shipListExtra[idx].consumption)  ;
            }
        }

        if(sum){
            this.speed = slowest;
            this.duration = duration;
            this.consumption = consumption;
        } else {
            this.speed = 0;
            this.duration = 0;
            this.consumption = 0;
        }
    }

    @computed get usedCapacity(){
        return this.metal + this.crystal + this.deuterium;
    }
    
    @action tryChangingShipAmount(idx, amount, priceList, baseResources){
        
        do{
            if(!(idx in this.ships)){
                console.warn("Ship not found:", idx);
                break;
            }

            if(amount > Fleet.unitLimit){
                amount = Fleet.unitLimit;
            }
            
            let metal = baseResources.metal,
                crystal = baseResources.crystal,
                deuterium = baseResources.baseDeuterium;
                
            if(this.ships[idx]==amount){
                
                break;
                
            } else if(this.ships[idx] > amount){
                let dif = this.ships[idx] - amount;
                metal += (dif * priceList.metal);
                crystal += (dif * priceList.crystal);
                deuterium += (dif * priceList.deuterium);

                this.updateShipAmountAndStats(idx, amount, priceList);
            } else {
                let dif = amount - this.ships[idx];
                let originalMetalUsed = priceList.metal * this.ships[idx],
                    originalCrystalUsed = priceList.crystal * this.ships[idx],
                    originalDeuteriumUsed = priceList.deuterium * this.ships[idx],
                    extraMetal,
                    extraCrystal,
                    extraDeuterium;

                //Loop until we are allowed to build more ships of this type
                while(dif){
                    extraMetal = amount * priceList.metal;
                    extraCrystal = amount * priceList.crystal;
                    extraDeuterium = amount * priceList.deuterium;

                    if(
                        metal + originalMetalUsed >= extraMetal &&
                        crystal + originalCrystalUsed >= extraCrystal &&
                        deuterium + originalDeuteriumUsed >= extraDeuterium
                    ) {
                        break;
                    }

                    dif--;
                    amount = this.ships[idx] + dif;
                }

                metal -= (dif * priceList.metal);
                crystal -= (dif * priceList.crystal);
                deuterium -= (dif * priceList.deuterium);

                this.updateShipAmountAndStats(idx, amount, priceList);
            }
            
            baseResources.metal = metal;
            baseResources.crystal = crystal;
            baseResources.deuterium = deuterium;

        } while(false);
        return {amount: amount, baseResources: baseResources};
    }

    static calcSpeed(motorLevel, speed, factor){
        return speed * (1 + motorLevel*factor/10 );
    }

    static calcConsumption(distance, duration, speed, amount, consumption){
        var av = (35000 / (duration - 10) ) * Math.sqrt(distance * 10 / speed);
        return Math.round( ((amount * consumption * distance )/35000 * Math.pow(av/ 10 + 1, 2 )));
    }
    
}

export default PlayerFleet;