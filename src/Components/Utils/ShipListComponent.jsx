import React, { Component } from 'react';
import { observer } from 'mobx-react';

@observer
class ShipListComponent extends Component {

    render() {

        return (
            <table className="tbl-active-ships">
                <tbody>
                    {this.props.store.validShips.map((x, i) =>
                        <tr key={"ship-list-"+this.props.module+'-'+x} className={ this.props.shipList[x] ? '' : 'hidden' }>
                            <td className="ship-desc">
                                { this.props.priceList[x].name }
                            </td><td>
                            <img src={ window.bvConfig.iconPath+x+'.gif' }
                                 height="20" width="20" />
                        </td><td><span className="amount">{this.props.store.ships[x]}</span></td>
                        </tr>
                    )}
                </tbody>
            </table>
        )
    }
}

export default ShipListComponent;