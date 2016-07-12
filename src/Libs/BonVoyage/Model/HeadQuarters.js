import { observable, action } from 'mobx';

class HeadQuarters {

    static defaultMetal = 4500000;
    static defaultCrystal = 2400000;
    static defaultDeuterium = 540000;

    @observable metal = 0;
    @observable crystal = 0;
    @observable deuterium = 0;

    @action reset(){
        this.metal = HeadQuarters.defaultMetal;
        this.crystal = HeadQuarters.defaultCrystal;
        this.deuterium = HeadQuarters.defaultDeuterium;
    }

}

export default HeadQuarters;