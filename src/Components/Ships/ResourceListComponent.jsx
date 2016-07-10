import React, { Component } from 'react';
import { computed } from 'mobx';
import { observer } from 'mobx-react';


@observer
class ResourceListComponent extends Component {

    @computed get calcUsedCapacity(){
        return Math.min(
            this.props.headQuarters.metal+this.props.headQuarters.crystal+this.props.headQuarters.deuterium,
            this.props.playerFleet.capacity
        );
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
                        <td>{this.props.headQuarters.metal}</td>
                        <td>{this.props.headQuarters.crystal}</td>
                        <td>{this.props.headQuarters.deuterium}</td>
                    </tr>
                    </tbody>
                </table>
                <table className="tbl-resources">
                    <tbody>
                        <tr>
                            <th className="half">Capacity</th>
                            <td><span className={(this.calcUsedCapacity < this.props.playerFleet.capacity)?'text-info':'text-error'}>
                                    {this.calcUsedCapacity}</span>/{this.props.playerFleet.capacity}</td>
                        </tr>
                        <tr>
                            <th>Consumption</th>
                            <td>{this.props.playerFleet.consumption}</td>
                        </tr>
                        <tr>
                            <th>Speed</th>
                            <td>{this.props.playerFleet.speed}</td>
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