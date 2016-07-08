import React, { Component } from 'react';

import SelectorItemComponent from './SelectorItemComponent';

class SelectorComponent extends Component {

    render() {

        var validShipIds = this.props.store.validConstructibleShips;

        return (
            <div>
                <table className="tbl-ships">
                    <tbody>
                        <tr>
                            {validShipIds.map((x, i) =>
                                <SelectorItemComponent store={this.props.store}
                                                       key={'shipInput-'+x}
                                                       shipData={this.props.priceList[x]} shipId={x} />
                            )}
                        </tr>
                    </tbody>
                </table>
            </div>
        )
    }
}

export default SelectorComponent;