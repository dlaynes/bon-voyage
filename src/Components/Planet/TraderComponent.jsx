import React, { Component } from 'react';

class TraderComponent extends Component {

    render() {

        return (
            <div className={this.props.visibility?'':'hidden'}>
                <h4>Trader</h4>
                <p>Nothing to trade!</p>
            </div>
        );
    }
}

export default TraderComponent;