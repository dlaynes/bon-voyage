import React, { Component } from 'react';

import Fleet from '../../Libs/BonVoyage/Model/Fleet';
import ShipListItemComponent from './ShipList/ShipListItemComponent';

class ShipListComponent extends Component {

    validShips = Fleet.allBattleFleet; /* Try not to break the screen size */
    
    render() {
        return (
            <table className="tbl-active-ships">
                <tbody>
                    {this.validShips.map((x, i) =>
                        <ShipListItemComponent
                            key={"ship-list-"+this.props.module+'-'+x}
                            idx={x}
                            fleet={this.props.fleet}
                            priceList={this.props.priceList}
                        />
                    )}
                </tbody>
            </table>
        )
    }
}

export default ShipListComponent;