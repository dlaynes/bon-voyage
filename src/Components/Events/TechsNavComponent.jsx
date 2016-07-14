import React, { Component } from 'react';
import { observer } from 'mobx-react';

@observer
class TechsNavComponent extends Component {

    render(){

        return(
            <table className="mini-techs-table">
                <tbody>
                    <tr>
                        <td className="one-third">Military tech</td>
                        <td className="one-third">Shielding tech</td>
                        <td>Armor tech</td>
                    </tr>
                    <tr>
                        <td>&nbsp;<span className="text-warning">{this.props.techList['109']}</span>&nbsp;</td>
                        <td>&nbsp;<span className="text-warning">{this.props.techList['110']}</span>&nbsp;</td>
                        <td>&nbsp;<span className="text-warning">{this.props.techList['111']}</span>&nbsp;</td>
                    </tr>
                </tbody>
            </table>
        )
    }
}

export default TechsNavComponent;