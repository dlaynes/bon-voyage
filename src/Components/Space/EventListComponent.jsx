import React, { Component } from 'react';
import { observer } from 'mobx-react';

@observer
class EventListComponent extends Component {

    static formatTime(time){
        return new Date(time * 1000).toISOString().substr(14, 5);
    }
    
    render() {
        let events = this.props.store.pastEvents.slice();
        events.reverse();
        
        return (
            <ul className="unstyled text-info" id="time-events">
                {events.map( (x,i) =>
                    <li key={'event-'+x.time}><span>{EventListComponent.formatTime(x.time)}</span> <span>- {x.message}</span></li>
                )}
            </ul>
        );
    }

}
export default EventListComponent;