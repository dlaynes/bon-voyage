import React, { Component } from 'react';
import { observer } from 'mobx-react';

import ShipListComponent from './Utils/ShipListComponent';
import TechsNavComponent from './Events/TechsNavComponent';

@observer
class EventComponent extends Component {
    render () {
        const event = this.props.store.currentEvent;

        const path = window.bvConfig.resourcePath;
        //console.log(event);

        let metalClass = '', metal_extra = '';
        if(event.metal > 0){
            if(event.type=='steal-battle' || event.type=='nothing'){
                metalClass = 'text-warning';
            } else {
                metal_extra = '+';
                metalClass = 'text-success';
            }
        } else {
            metalClass = 'text-error';
        }

        let crystalClass = '', crystal_extra = '';
        if(event.crystal > 0){
            if(event.type=='steal-battle' || event.type=='nothing'){
                crystalClass = 'text-warning';
            } else {
                crystal_extra = '+';
                crystalClass = 'text-success';
            }
        } else {
            crystalClass = 'text-error';
        }

        let deuteriumClass = '', deuterium_extra = '';
        if(event.deuterium > 0){
            if(event.type=='steal-battle' || event.type=='nothing'){
                deuteriumClass = 'text-warning';
            } else {
                deuterium_extra = '+';
                deuteriumClass = 'text-success';
            }
        } else {
            deuteriumClass = 'text-error';
        }
        return (
            <div className={ this.props.visibility ? '' : 'hidden' }>
                <h3>{this.props.store.currentEvent.title}</h3>
                <p>{this.props.store.currentEvent.description}</p>
                <div className="clear"></div>
                    <ul className="event-resources">
                        <li className={event.metal?'':'hidden-item'}><img src={path+'metall.gif'} /><br /><small>Metal</small><br />
                            <span className={metalClass}>{metal_extra}{event.metal}</span>
                        </li>
                        <li className={event.crystal?'':'hidden-item'}><img src={path+'kristall.gif'} /><br /><small>Crystal</small><br />
                            <span className={crystalClass}>{crystal_extra}{event.crystal}</span>
                        </li>
                        <li className={event.deuterium?'':'hidden-item'}>
                            <img src={path+'deuterium.gif'} /><br /><small>Deuterium</small><br />
                            <span className={deuteriumClass}>{deuterium_extra}{event.deuterium}</span>
                        </li>
                        <li className={event.spaceCredits?'':'hidden-item'}>
                            <img src={path+'message.gif'} /><br /><small>Space Credits</small><br />
                            <span className={event.spaceCredits > 0 ? 'text-success':'text-error'}>{event.spaceCredits > 0 ? '+':''}{event.spaceCredits}</span>
                        </li>
                    </ul>
                <div className="clear"></div>
                <div className={(event.type=='steal-battle' || event.type=='raid-planet' || event.type== 'battle' || event.type=='add-ships' || event.type=='remove-ships')?'':'hidden'}>
                    <div className="pull-left half">
                        <div className={(event.type=='steal-battle' || event.type== 'battle' || event.type== 'raid-planet')?'':'hidden'}>
                        <TechsNavComponent techList={this.props.store.playerFleet.techs} />
                        </div>
                        <ShipListComponent module="event" fleet={this.props.store.playerFleet}
                                           store={this.props.store} priceList={this.props.priceList} />
                    </div>
                    <div className={(event.type=='steal-battle' || event.type== 'battle' || event.type== 'raid-planet')?'pull-right half':'hidden'}>
                        <TechsNavComponent techList={this.props.store.enemyFleet.techs} />
                        <ShipListComponent module="event" fleet={this.props.store.enemyFleet}
                                           store={this.props.store} priceList={this.props.priceList} />
                    </div>
                </div>
                <div className="clear"></div>
                <div className="text-center">
                    <button onClick={this.actionContinue} className={event.validActions.continue?'action-red':'hidden'}>» CONTINUE</button>
                    <button onClick={this.actionTake} className={event.validActions.take?'text-success':'hidden'}>» TAKE</button>
                    <button onClick={this.actionSkip} className={event.validActions.skip?'text-warning':'hidden'}>» SKIP</button>
                    <button onClick={this.actionAttack} className={event.validActions.attack?'action-red':'hidden'}>» ATTACK</button>
                    <button onClick={this.actionFlee} className={event.validActions.flee?'text-warning':'hidden'}>» FLEE</button>
                    <button onClick={this.actionNegotiate} className={event.validActions.negotiate?'text-info':'hidden'}>» NEGOTIATE</button>
                    <button onClick={this.actionReturn} className={event.validActions.return?'text-error':'hidden'}>» RETURN</button>
                </div>
            </div>
        );
    }

    actionContinue = () => {
        this.props.store.eventManager.trigger('continue');
    };
    
    actionTake = () => {
        this.props.store.eventManager.trigger('take');
    };

    actionSkip = () => {
        this.props.store.eventManager.trigger('skip');
    };

    actionReturn = () => {
        this.props.store.eventManager.trigger('return');
    };
    
    actionAttack = () => {
        this.props.store.eventManager.trigger('attack');
    };
    
    actionFlee = () => {
        this.props.store.eventManager.trigger('flee');
    };

    actionNegotiate = () => {
        this.props.store.eventManager.trigger('negotiate');
    };
}
export default EventComponent;