import React, { Component } from 'react';

import SelectorItemComponent from './SelectorItemComponent';

class SelectorComponent extends Component {

    render() {

        var validShipIds = [202,203,204,205,206,207,208,209,210,211,213,214,215];

        return (
            <div>
                <table className="tbl-ships" cellPadding="0" cellSpacing="0">
                    <tbody>
                        <tr>
                            {validShipIds.map((x, i) =>
                                x != 214 ? <SelectorItemComponent key={'shipInput-'+x} shipData={this.props.priceList[x]} shipId={x} /> : null
                            )}
                        </tr>
                    </tbody>
                </table>
            </div>
        )
    }

}

export default SelectorComponent;