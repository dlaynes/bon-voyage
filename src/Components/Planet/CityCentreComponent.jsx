import React, { Component } from 'react';

class CityCentreComponent extends Component {

    render() {

        return (
            <div className={this.props.visibility?'':'hidden'}>
                <h4>City Centre</h4>
                <p>Nothing to do!</p>
            </div>
        );
    }
}

export default CityCentreComponent;