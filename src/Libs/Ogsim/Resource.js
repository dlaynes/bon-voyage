class Resource {
    static PLANET = "10001";
    static MOON = "10002";
    static DEBRIS = "10003";
    
    id = 0;
    name = '';
    rapidFire = {};
    capacity = 0;
    metal = 0;
    crystal = 0;
    deuterium = 0;
    attack = 0;
    defense = 0;
    hull = 0;
    code = '';
    
    constructor(pricelist, rapidFireRules){
        this.id = pricelist.id;
        this.name = pricelist.name;
        this.code = pricelist.code;
        
        this.metal = pricelist.metal ? pricelist.metal : 0;
        this.crystal = pricelist.crystal ?pricelist.crystal : 0;
        this.deuterium = pricelist.deuterium ?pricelist.deuterium : 0;
        this.attack = pricelist.attack ?pricelist.attack : 0;
        this.defense = pricelist.defense ?pricelist.defense : 0;
        this.hull = pricelist.hull ?pricelist.hull : 0;
        this.capacity = pricelist.capacity ? pricelist.capacity : 0;

        let r = 0.0;

        if(rapidFireRules){
            for( let n in rapidFireRules){
                if(!rapidFireRules.hasOwnProperty(n)){ continue; }
                r = rapidFireRules[n];

                this.rapidFire[n] = (1 - ( 1 / r ));
            }
        }        
    }    
}
export default Resource;