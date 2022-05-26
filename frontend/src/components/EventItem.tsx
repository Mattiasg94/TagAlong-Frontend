import React from 'react';
import Styles from '../styles/css/EventItem.module.scss'
import { Event } from '../types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as fontawesomeIcon from '../styles/fontawesome'
import formatDate from '../hooks/formatDate';


type EventItemType = {
    events: Event[],
    openModal: any
    EventAction: any
    EventActionBtnText: string
}

const EventItem = ({ events, openModal, EventAction, EventActionBtnText }: EventItemType): JSX.Element => {
    return <>{events.map((event) => (
        <div className={Styles.event} key={`event-${event.id}`}>
            <article onClick={() => openModal(event)}>
                <table>
                    <tbody>
                        <tr>
                            <td colSpan={3} className={Styles.title}>
                                <h4>{event.title}</h4>
                            </td>
                            <td className={Styles.date}>
                                <p>{formatDate(event.date)}</p>
                            </td>
                        </tr>
                        <tr>
                            <td  >
                                <p><FontAwesomeIcon icon={fontawesomeIcon.faUserFriends} /> <b>{event.invites.length - event.participants.length}</b></p>
                            </td>
                            <td>
                                <p><FontAwesomeIcon icon={fontawesomeIcon.faUserCheck} /> <b>{event.participants.length}</b></p>
                            </td>
                            <td>
                                <p>{event.user.username}</p>
                            </td>
                            <td className={Styles.buttonTd}>
                                <button className={Styles.add} onClick={(e) => EventAction(e, event)}>{EventActionBtnText}</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </article>
        </div>
    ))}
    </>
};
export default EventItem;
