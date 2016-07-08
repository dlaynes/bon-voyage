import React, { Component } from 'react';

class MarketComponent extends Component {

    render() {

        const path = window.bvConfig.resourcePath;

        return (
            <div className={this.props.visibility?'':'hidden'}>
                <h4>Resource Market</h4>
                <p>You can exchange your Space Credits for resources here</p>
                <table className="market-resources">
                    <tbody>
                    <tr>
                        <td><img src={path+'metall.gif'} /><br />
                            Metal
                        </td>
                        <td><img src={path+'kristall.gif'} /><br />
                            Crystal</td>
                        <td><img src={path+'deuterium.gif'} /><br />
                            Deuterium</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}

export default MarketComponent;