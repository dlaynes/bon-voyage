import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { computed } from 'mobx';

@observer
class ResearchLabItemComponent extends Component {

    @computed get currentPrice(){
        return ResearchLabItemComponent.calcPrice(
            this.props.techData.basePrice,
            this.props.techData.factor,
            this.props.store.techs[this.props.techId]+1);
    }

    render() {
        const techId = this.props.techId;
        const imgUrl = window.bvConfig.iconPath+techId+'.gif';

        return (
            <td>
                <span className="name">{this.props.techData.name}</span>
                <img src={imgUrl} height="48" width="48" />
                <span className="text-info">{this.props.store.techs[techId]}</span><br />
                <span className="text-warning">§ {this.currentPrice}</span>
                <table className="mini-buttons" cellPadding="0" cellSpacing="0">
                    <tbody>
                    <tr>
                        <td><button className="text-success" onClick={this.addOne}>+1</button></td>
                    </tr>
                    </tbody>
                </table>
            </td>
        )
    }
    
    static calcPrice(basePrice, factor, desiredLevel){
        return (basePrice * Math.pow( factor, ( desiredLevel - 1 ) ) );
    }

    addOne = (event) => {
        this.props.tryToPurchaseItem(this.props.techId);
    }
}

export default ResearchLabItemComponent;