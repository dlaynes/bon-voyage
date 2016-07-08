import React, { Component } from 'react';
import { computed } from 'mobx';
import { observer } from 'mobx-react';

@observer
class ResourceListComponent extends Component {

    static formatTime(time){
        return new Date(time * 1000).toISOString().substr(14, 5);
    }

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
                        <td>{this.props.store.metal}</td>
                        <td>{this.props.store.crystal}</td>
                        <td>{this.props.store.deuterium}</td>
                    </tr>
                    </tbody>
                </table>
                <table className="tbl-resources">
                    <tbody>
                    <tr>
                        <th className="half">Capacity</th>
                        <td>{this.props.store.usedCapacity}/{this.props.store.capacity}</td>
                    </tr>
                    <tr>
                        <th>Consumption</th>
                        <td>{this.props.store.consumption}</td>
                    </tr>
                    <tr>
                        <th>Time Unit</th>
                        <td>{ResourceListComponent.formatTime(this.props.store.timeUnit)}</td>
                    </tr>
                    <tr>
                        <th>Speed</th>
                        <td>{this.props.store.speed}</td>
                    </tr>
                    <tr>
                        <th>Speed %</th>
                        <td>{this.props.store.fleetSpeed}0%</td>
                    </tr>
                    <tr>
                        <th>Distance</th>
                        <td><span className="text-info">{this.props.store.distance.toFixed(2)}</span></td>
                    </tr>
                    <tr>
                        <th>Ships</th>
                        <td>{this.props.store.shipCount}</td>
                    </tr>
                    <tr>
                        <th>Space Credits</th>
                        <td><span className="text-success">{this.props.store.spaceCredits}</span></td>
                    </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}

export default ResourceListComponent;