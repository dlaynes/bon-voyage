import React, { Component } from 'react';
import { observer } from 'mobx-react';

@observer
class SelectorItemComponent extends Component {
    
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
                            <td><button className="text-error" onClick={this.minusOne}>-1</button></td>
                        </tr>
                        <tr>
                            <td><button className="text-info" onClick={this.addTen}>+10</button></td>
                            <td><button className="text-error" onClick={this.minusTen}>-10</button></td>
                        </tr>
                    </tbody>
                </table>
            </td>
        )
    }

    addOne = (event) => {
        this.changeAmount(this.props.store.ships[this.props.shipId]+1, true);
    };

    addTen = (event) => {
        this.changeAmount(this.props.store.ships[this.props.shipId]+10, true);
    };

    minusOne = (event) => {
        this.changeAmount(this.props.store.ships[this.props.shipId]-1, false);
    };

    minusTen = (event) => {
        this.changeAmount(this.props.store.ships[this.props.shipId]-10, false);
    };

    changeAmount(amount, increasing){
        this.props.tryToAlterShipCount(this.props.shipId, amount, increasing);
    }
}

export default SelectorItemComponent;