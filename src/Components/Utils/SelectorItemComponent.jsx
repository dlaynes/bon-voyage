import React, { Component } from 'react';

class SelectorItemComponent extends Component {
    render() {
        let imgUrl = '/ogame/skins/EpicBlue/gebaeude/'+this.props.shipId+'.gif';
        return (
            <td>
                <span className="name">{this.props.shipData.name}</span>
                <br /><img src={imgUrl} height="48" width="48" />
                <br /><input className="resource-fleet" min="0" max="999" type="number" value="0"
                             onChange={(e) => this.chooseShip(e, this.value)}/>
            </td>
        )
    }

    chooseShip(event, value){
        console.log(value);
    }
}

export default SelectorItemComponent;