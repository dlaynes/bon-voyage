import React, { Component } from 'react';

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
                            <td><span className="metal">0</span></td>
                            <td><span className="crystal">0</span></td>
                            <td><span className="deuterium">0</span></td>
                        </tr>
                    </tbody>
                </table>
                <table className="tbl-resources">
                    <tbody>
                        <tr>
                            <td>Capacity</td>
                            <td><span className="text-error capacity">0</span>/<span className="capacity_max">0</span></td>
                        </tr>
                        <tr>
                            <td>Consumption</td>
                            <td><span className="consumption">0</span></td>
                        </tr>
                        <tr>
                            <td>Speed</td>
                            <td><span className="speed">0</span></td>
                        </tr>
                        <tr>
                            <td>Ships</td>
                            <td><span className="ships">0</span></td>
                        </tr>
                        <tr>
                            <td>Space Credits</td>
                            <td><span className="space-credits text-success">0</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}

export default ResourceListComponent;