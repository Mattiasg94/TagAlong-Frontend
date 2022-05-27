import React from 'react';
import Styles from '../styles/css/EventItem.module.scss'
import { Event, User } from '../types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as fontawesomeIcon from '../styles/fontawesome'
import formatDate from '../hooks/formatDate';
import SStyles from '../styles/css/Shared.module.scss'


type EventItemType = {
    currentUser: User
    events: Event[],
    openModal: any
    EventAction: any
    EventActionBtnText: string
}
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const EventItem = ({ currentUser, events, openModal, EventAction, EventActionBtnText }: EventItemType): JSX.Element => {
    let currentDivider = ''
    let dayCounter = 0
    const nowDate = new Date()

    function getDateDevider(event: Event): string | boolean { // TODO fix so it works with hours also
        const newDivider = String(days[(new Date(event.date)).getDay()])
        if (currentDivider !== newDivider && dayCounter !== 6) {
            currentDivider = newDivider
            dayCounter = dayCounter + 1
            return newDivider
        }
        return false
        // const days = Math.round(((new Date(event.date)).getTime() - nowDate.getTime()) / (1000 * 60 * 60 * 24));
    }
    return <>{events.map((event, idx) => (
        <div className={Styles.event} key={`event-${event.id}`}>
            <p className={`${SStyles.center} m-0`}>{getDateDevider(event) ?? ''}</p>
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
                                <p><FontAwesomeIcon className={`${currentUser.friends.map((f) => f.id).includes(event.user.id) ? SStyles.addC : SStyles.delC}`} icon={fontawesomeIcon.faUserFriends} />{event.user.username}</p>
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
