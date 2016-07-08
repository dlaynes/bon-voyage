import React, { Component } from 'react';
import { computed } from 'mobx';
import { observer } from 'mobx-react';


@observer
class ResourceListComponent extends Component {

    @computed get calcUsedCapacity(){
        return Math.min(
            this.props.store.baseMetal+this.props.store.baseCrystal+this.props.store.baseDeuterium,
            this.props.store.capacity
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
                        <td>{this.props.store.baseMetal}</td>
                        <td>{this.props.store.baseCrystal}</td>
                        <td>{this.props.store.baseDeuterium}</td>
                    </tr>
                    </tbody>
                </table>
                <table className="tbl-resources">
                    <tbody>
                        <tr>
                            <th className="half">Capacity</th>
                            <td><span className={(this.calcUsedCapacity < this.props.store.capacity)?'text-info':'text-error'}>
                                    {this.calcUsedCapacity}</span>/{this.props.store.capacity}</td>
                        </tr>
                        <tr>
                            <th>Consumption</th>
                            <td>{this.props.store.consumption}</td>
                        </tr>
                        <tr>
                            <th>Speed</th>
                            <td>{this.props.store.speed}</td>
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