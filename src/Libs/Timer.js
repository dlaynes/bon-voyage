class Timer {
    records = {};

    start(id){
        this.records[id] = {
            start : new Date().getTime(),
            end : null
        };
    }

    end(id){
        if(!this.records[id]){
            //console.log( "Timer "+id+" not available!!");
            return;
        }
        this.records[id].end = new Date().getTime();
    }
    buildResults(){
        for( var id in this.records ){
            if(!this.records.hasOwnProperty(id)){ continue; }

            if(!this.records[id].end){
                //console.log( "Timer "+id+" not closed!!");
                continue;
            }
            this.records[id].description = this.records[id].end - this.records[id].start;
            delete this.records[id].start;
            delete this.records[id].end;
        }
    }
}
export default Timer;