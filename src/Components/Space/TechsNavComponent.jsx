import React, { Component } from 'react';
import { observer } from 'mobx-react';

@observer
class TechsNavComponent extends Component {
    
    render(){

        console.log("Inside techs nav component",this.props.store.techs);

        return(
            <div className="techs-nav">
                <table>
                    <tbody>
                        <tr>
                            <td>Military tech</td>
                            <td>&nbsp;<span className="text-success">{this.props.store.techs['109']}</span>&nbsp;</td>
                            <td>Defense tech</td>
                            <td>&nbsp;<span className="text-success">{this.props.store.techs['110']}</span>&nbsp;</td>
                            <td>Hull tech</td>
                            <td>&nbsp;<span className="text-success">{this.props.store.techs['111']}</span>&nbsp;</td>
                        </tr>
                        <tr>
                            <td>Combustion Drive</td>
                            <td>&nbsp;<span className="text-success">{this.props.store.techs['115']}</span>&nbsp;</td>
                            <td>Impulse Drive</td>
                            <td>&nbsp;<span className="text-success">{this.props.store.techs['117']}</span>&nbsp;</td>
                            <td>Hyperspace Drive</td>
                            <td>&nbsp;<span className="text-success">{this.props.store.techs['118']}</span>&nbsp;</td>
                        </tr>
                    </tbody>
                </table>
            </div>            
        )
    }
}

export default TechsNavComponent;