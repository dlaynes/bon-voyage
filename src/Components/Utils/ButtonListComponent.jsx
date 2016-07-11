import { observer } from 'mobx';
import React, { Component } from 'react';

import GameState from '../../Libs/BonVoyage/Model/GameState';

@observer
class ButtonListComponent extends Component {

    render(){
        return (
            <div className="bottom-menu text-center">
                <div className="clear"></div>
                <span className={this.props.store.currentState!=GameState.states.planet?'hidden':''}>Go to:</span>
                <button className={this.props.store.currentState!=GameState.states.home?'hidden':''}>» CREATE EXPEDITION FLEET</button>
                <button className={this.props.store.currentState!=GameState.states.home?'hidden':''}>» PORT</button>
                <button className={this.props.store.currentState!=GameState.states.home?'hidden':''}>» SHIPYARD</button>
                <button className="text-info">» MARKET</button>
                <button className="text-info">» TRADER</button>
                <button className="text-info">» LAB</button>
                <button className="text-error">» LEAVE PLANET</button>
                <br />
                <small>ENTER :select
                    <span className={this.props.store.commands.active_list.length > 1?'':'hidden'}>ARROWS: toggle action</span></small>
            </div>
        );
    }
}

export default ButtonListComponent;