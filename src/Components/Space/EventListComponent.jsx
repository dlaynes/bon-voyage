import React, { Component } from 'react';
import { observer } from 'mobx-react';

@observer
class EventListComponent extends Component {

    render() {
        let events = this.props.store.pastEvents.slice();
        events.reverse();
        
        return (
            <div className="pull-right">
                <ul className="unstyled text-info" id="time-events">
                    {events.map( (x,i) =>
                        <li><span>{this.props.store.formatTime(x.time)}</span> <span>- {x.message}</span></li>
                    )}
                </ul>
            </div>
        );
    }

}
export default EventListComponent;