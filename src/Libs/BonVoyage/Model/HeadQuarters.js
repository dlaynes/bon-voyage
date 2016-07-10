import { observable, action } from 'mobx';

class HeadQuarters {

    static defaultMetal = 3000000;
    static defaultCrystal = 1600000;
    static defaultDeuterium = 350000;

    @observable baseMetal = 0;
    @observable baseCrystal = 0;
    @observable baseDeuterium = 0;

    @action resetBaseResources(){
        this.baseMetal = HeadQuarters.defaultMetal;
        this.baseCrystal = HeadQuarters.defaultCrystal;
        this.baseDeuterium = HeadQuarters.defaultDeuterium;
    }

}

export default HeadQuarters;