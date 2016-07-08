class GameLoop {

    previousTimestamp = null;
    speed = 1000;
    running = false;
    func = function(){};

    setSpeed(speed){
        this.speed = speed;
    }
    
    setHandler(func){
        this.func = func;
    }

    play(){
        this.running = true;
        this.loop();
    }
    
    pause(){
        this.running = false;
    }
    
    loop = (timestamp) => {
        if(!timestamp) timestamp = 0;

        if(!this.previousTimestamp){
            this.previousTimestamp = timestamp;
        }

        //console.log("looping");

        var progress = timestamp - this.previousTimestamp;
        //console.log("progress", progress);
        if(progress >= this.speed) {
            this.previousTimestamp = timestamp;
            this.func();
        }
        if(this.running){
            window.requestAnimationFrame(this.loop );
        }
    };
    
    reset(){
        this.previousTimestamp = null;
        this.running = false;
    }
}
export default GameLoop;