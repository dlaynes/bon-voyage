import React, { Component } from 'react';
import { observer } from 'mobx-react';

@observer
class ShipyardItemComponent extends Component {

    render() {
        const shipId = this.props.shipId;
        const imgUrl = window.bvConfig.iconPath+shipId+'.gif';
        
        return (
            <td>
                <span className="name">{this.props.shipData.name}</span>
                <img src={imgUrl} height="48" width="48" />
                <span className="text-info">{this.props.store.ships[shipId]}</span>
                <table className="mini-buttons" cellPadding="0" cellSpacing="0">
                    <tbody>
                    <tr>
                        <td><button className="text-success" onClick={this.addOne}>+1</button></td>
                    </tr>
                    <tr>
                        <td><button className="text-success" onClick={this.addTen}>+10</button></td>
                    </tr>
                    </tbody>
                </table>
            </td>
        )
    }

    addOne = (event) => {
        this.changeAmount(this.props.store.ships[this.props.shipId]+1);
    };

    addTen = (event) => {
        this.changeAmount(this.props.store.ships[this.props.shipId]+10);
    };

    changeAmount(amount){
        if(amount < 0){ amount = 0; }
        let spaceBuy = true;
        this.props.store.tryUsingShipAmount(this.props.shipId, amount, this.props.shipData, spaceBuy);
    }
}

export default ShipyardItemComponent;