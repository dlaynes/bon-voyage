import React, { Component } from 'react';
import { observer } from 'mobx-react';

@observer
class ResourceListComponent extends Component {
    render() {
        return (
            <div>
                <table className="tbl-resources">
                    <thead>
                        <tr>
                            <th className="one-third">Metal</th>
                            <th className="one-third">Crystal</th>
                            <th>Deuterium</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{this.props.store.baseMetal}</td>
                            <td>{this.props.store.baseCrystal}</td>
                            <td>{this.props.store.baseDeuterium}</td>
                        </tr>
                    </tbody>
                </table>
                <table className="tbl-resources">
                    <tbody>
                        <tr>
                            <td className="half">Capacity</td>
                            <td><span className="text-error">{this.props.store.calcUsedCapacity}</span>/{this.props.store.capacity}</td>
                        </tr>
                        <tr>
                            <td>Consumption</td>
                            <td>{this.props.store.consumption}</td>
                        </tr>
                        <tr>
                            <td>Speed</td>
                            <td>{this.props.store.speed}</td>
                        </tr>
                        <tr>
                            <td>Ships</td>
                            <td>{this.props.store.shipCount}</td>
                        </tr>
                        <tr>
                            <td>Space Credits</td>
                            <td><span className="text-success">{this.props.store.spaceCredits}</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}

export default ResourceListComponent;