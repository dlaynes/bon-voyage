class Space {

    static defaultDistance = 120000;
    static minDistance = 50;

    static defaultIntervalSpeed = 1000;

    static calcProgress(durationMoment, maxDistance){
        var ticks = durationMoment * 0.6;
        return maxDistance / ticks;
    }
    
}

export default Space;