import React, { Component } from 'react';
import { observer } from 'mobx-react';

@observer
class SelectorItemComponent extends Component {

    timeout = null;

    /*
    constructor(props){
        super(props);
        this.state = {
            value : props.store.ships[props.shipId]
        };
    }
    */

    render() {
        let imgUrl = '/ogame/skins/EpicBlue/gebaeude/'+this.props.shipId+'.gif';
        //let amount = this.props.store.ships[this.props.shipId];
        const shipId = this.props.shipId;

        return (
            <td>
                <span className="name">{this.props.shipData.name}</span>
                <br /><img src={imgUrl} height="48" width="48" />
                <br />
                <span className="text-info">{this.props.store.ships[this.props.shipId]}</span><br />
                <button className="text-success" onClick={this.addOne}>+1</button><br />
                <button className="text-success" onClick={this.addTen}>+10</button><br />
                <button className="text-error" onClick={this.minusOne}>-1</button>
            </td>
        )
    }

    addOne = (event) => {
        this.changeAmount(this.props.store.ships[this.props.shipId]+1);
    };

    addTen = (event) => {
        this.changeAmount(this.props.store.ships[this.props.shipId]+10);
    };

    minusOne = (event) => {
        this.changeAmount(this.props.store.ships[this.props.shipId]-1);
    };

    changeAmount(amount){
        if(amount < 0){ amount = 0; }
        this.props.store.tryUsingShipAmount(this.props.shipId, amount, this.props.shipData);
    }
}

export default SelectorItemComponent;