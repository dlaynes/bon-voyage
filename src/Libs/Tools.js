class Tools {
    static fillArray(val, num){
        let data = [];
        //while(i<num) {
        for(let i=0; i<num; i++){
            data.push(val.slice(0));
            //i++;
        }
        return data;

        /* Slower
         var data = new Array(num);
         var i=0;
         while (i<num) {
         data[i] = val.slice(0);
         i++;
         }
         return data;
         */
    }

    static calcAverage(datalist){
        if(!datalist.length){ return 0; }
        if(datalist.length==1){ return datalist[0]; }

        let sum = 0;
        for(let i=0; i<datalist.length; i++ ){
            sum += datalist[i];
        }
        return sum / datalist.length;
    }

    static calcStandardDeviation(datalist){
        if(!datalist.length){ return [0, 0]; }
        if(datalist.length==1){ return [0, datalist[0]]; } //avoid infinites

        let sum = 0, avg = tools.calcAverage(datalist), sdp;
        for(let i=0; i<datalist.length; i++ ){
            sum += (datalist[i] - avg) * (datalist[i] - avg);
        }
        sdp = (1 / (datalist.length - 1 ) ) * sum;
        return [Math.sqrt(sdp), avg];
    }

    static appendToArray(data, val, num){
        for(let i=0; i<num; i++){
            data.push(val.slice(0));
        }
    }

    static bytesToSize(bytes) {
        if(bytes === 0) return '0 Bytes';
        let k = 1000;
        let sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        let i = Math.floor(Math.log(bytes) / Math.log(k));
        return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
    }
}

export default Tools;