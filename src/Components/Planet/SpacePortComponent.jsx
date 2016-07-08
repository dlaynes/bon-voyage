import React, { Component } from 'react';

class SpacePortComponent extends Component {

    render() {
        return (
            <div className={this.props.visibility?'':'hidden'}>
                <h4>Space Port</h4>
                <p>Welcome to the planet!</p>
            </div>
        );
    }
}

export default SpacePortComponent;