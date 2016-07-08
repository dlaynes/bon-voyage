import React, { Component } from 'react';

import ShipyardItemComponent from './ShipyardItemComponent';

class ShipyardComponent extends Component {

    render() {

        var validShipIds = this.props.store.validConstructibleShips;

        return (
            <div className={this.props.visibility?'':'hidden'}>
                <h4>Shipyard</h4>
                <table className="tbl-ships tbl-ships-space">
                    <tbody>
                    <tr>
                        {validShipIds.map((x, i) =>
                            <ShipyardItemComponent store={this.props.store}
                                                   key={'shipYardInput-'+x}
                                                   shipData={this.props.priceList[x]} shipId={x} />
                        )}
                    </tr>
                    </tbody>
                </table>
            </div>
        )
    }
}

export default ShipyardComponent;
