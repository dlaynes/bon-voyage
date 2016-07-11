import React, { Component } from 'react';
import { computed } from 'mobx';
import { observer } from 'mobx-react';

@observer
class ResourceListComponent extends Component {

    static formatTime(time){
        return new Date(time * 1000).toISOString().substr(14, 5);
    }

    render() {
        let speedClass = '';
        if(this.props.playerFleet.fleetSpeed > 10){
            speedClass = 'current_capacity';
        } else if(this.props.playerFleet.fleetSpeed < 10){
            speedClass = 'slow_down';
        }

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
                        <td>{this.props.playerFleet.metal}</td>
                        <td>{this.props.playerFleet.crystal}</td>
                        <td><span className="text-error">{this.props.playerFleet.deuterium}</span></td>
                    </tr>
                    </tbody>
                </table>
                <table className="tbl-resources">
                    <tbody>
                    <tr>
                        <th className="half">Capacity</th>
                        <td>{this.props.playerFleet.usedCapacity}/{this.props.playerFleet.capacity}</td>
                    </tr>
                    <tr>
                        <th>Consumption</th>
                        <td>{this.props.playerFleet.consumption}</td>
                    </tr>
                    <tr>
                        <th>Time Unit</th>
                        <td>{ResourceListComponent.formatTime(this.props.playerFleet.timeUnit)}</td>
                    </tr>
                    <tr>
                        <th>Speed</th>
                        <td><span className={speedClass}>{this.props.playerFleet.speed}</span></td>
                    </tr>
                    <tr>
                        <th>Speed %</th>
                        <td><span className={speedClass}>{this.props.playerFleet.fleetSpeed}0%</span></td>
                    </tr>
                    <tr>
                        <th>Distance</th>
                        <td><span className="text-info">{this.props.playerFleet.distance.toFixed(2)}</span></td>
                    </tr>
                    <tr>
                        <th>Ships</th>
                        <td>{this.props.playerFleet.shipCount}</td>
                    </tr>
                    <tr>
                        <th>Space Credits</th>
                        <td><span className="text-success">§ {this.props.playerFleet.spaceCredits}</span></td>
                    </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}

export default ResourceListComponent;