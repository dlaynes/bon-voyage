import React, { Component } from 'react';
import { observer } from 'mobx-react';

import Fleet from '../../Libs/BonVoyage/Model/Fleet';

@observer
class ShipListComponent extends Component {

    validShips = Fleet.allBattleFleet; /* Try not to break the screen size */
    
    render() {
        console.log("new ships",this.props.fleet.ships);
        console.log("new ship changes",this.props.fleet.shipChanges);
        return (
            <table className="tbl-active-ships">
                <tbody>
                    {this.validShips.map((x, i) =>
                        <tr key={"ship-list-"+this.props.module+'-'+x} className={ (this.props.fleet.ships[x] || this.props.fleet.shipChanges[x]) ? '' : 'hidden' }>
                            <td className="ship-desc half">
                                { this.props.priceList[x].name }
                            </td><td className="one-fifth">
                            <img src={ window.bvConfig.iconPath+x+'.gif' }
                                 height="20" width="20" />
                        </td><td class="one-fifth"><span className="amount">{this.props.fleet.ships[x]}</span></td>
                            <td>{this.props.fleet.shipChanges[x] > 0 ? <span className="text-success">+{this.props.fleet.shipChanges[x]}</span>:''}
                                {this.props.fleet.shipChanges[x] < 0 ? <span className="text-error">{this.props.fleet.shipChanges[x]}</span>:''}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        )
    }
}

export default ShipListComponent;