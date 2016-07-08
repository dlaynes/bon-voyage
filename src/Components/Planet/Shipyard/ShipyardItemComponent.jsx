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
                        <td><button className="text-info" onClick={this.addOne}>+1</button></td>
                    </tr>
                    <tr>
                        <td><button className="text-info" onClick={this.addTen}>+10</button></td>
                    </tr>
                    </tbody>
                </table><br />
                <span className="text-warning">§ {this.props.shipData.sellingPrice}</span>
                <table className="mini-buttons" cellPadding="0" cellSpacing="0">
                    <tbody>
                    <tr>
                        <td><button className="text-success" onClick={this.purchaseOne}>+1</button></td>
                    </tr>
                    <tr>
                        <td><button className="text-success" onClick={this.purchaseTen}>+10</button></td>
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
        this.props.tryToIncreaseItem(this.props.shipId, amount);
    }
    
    purchaseOne = (event) => {
        this.purchaseAmount(1);
    };
    
    purchaseTen = (event) => {
        this.purchaseAmount(10);
    };
    
    purchaseAmount(amount){
        this.props.tryToPurchaseShip(this.props.shipId, amount);
    }
}

export default ShipyardItemComponent;