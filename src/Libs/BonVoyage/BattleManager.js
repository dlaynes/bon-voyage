class BattleManager {
    
    allyFleet = null;
    enemyFleet = null;
    simulator = null;
    
    constructor(simulator){
        this.simulator = simulator;
    }
    
    setAllyFleet(allyFleet){
        this.allyFleet = allyFleet;
    }
    
    setEnemyFleet(enemyFleet){
        this.enemyFleet = enemyFleet;
    }
}

export default BattleManager;