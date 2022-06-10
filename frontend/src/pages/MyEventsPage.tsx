import React, { useState, useEffect } from 'react';
import axios from "axios";
import { csrftoken } from '../csrftoken';
import FetchCurrentUser from '../FetchCurrentUser';
import { User, Event } from '../types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import EventItem from '../components/EventItem';
import ShowEventModal from '../components/modales/ShowEventModal';
import { useNavigate } from "react-router-dom";
import ConfirmModal from '../components/modales/ConfirmModal';
import { Subject } from 'rxjs';
import Styles from '../styles/css/MyEventsPage.module.scss'
import SStyles from '../styles/css/Shared.module.scss'
import LoadingSpinner from '../hooks/LoadingSpinner';

import {url} from '../routes';
const headers: any = { "X-CSRFTOKEN": csrftoken }
enum EVENT_ACTIVITY {
    ATTENDING,
    MY_EVENTS,
}
export default function MyEventsPage() {
    const navigate = useNavigate();
    let confirmModalClick = new Subject()
    const [isLoading, setIsLoading] = useState(true);

    const [events, setEvents] = useState<Event[]>([]);
    const [filteredEvents, setFilteredEvents] = useState<Event[]>([])
    const currentUser = FetchCurrentUser()
    const [modalEvent, setModalEvent] = useState<Event>();
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [confirmModalIsOpen, setConfirmModalIsOpen] = useState(false);
    const [confirmModalData, setConfirmModalData] = useState({});
    const [activeView, setActiveView] = useState<EVENT_ACTIVITY>()

    function openModal(event: Event) {
        setModalIsOpen(true);
        setModalEvent(event)
    }
    function openConfirmModal(event: Event) {
        setConfirmModalIsOpen(true);
        setConfirmModalData({ 'title': 'What do you want to do', 'btn1Text': 'Delete', 'btn2Text': 'Edit', 'event': event })
    }

    function fetchEvents() {
        axios
            .get(`${url}api/events/${currentUser.id}/myevents/`)
            .then((res) => {
                setEvents(res.data)
                setIsLoading(false)
            })
            .catch((error) => console.warn(error));
    }
    useEffect(() => {
        if (currentUser) {
            fetchEvents()
        }
    }, [currentUser])
    useEffect(() => {
        if (!isLoading) {
            if (typeof (activeView) === 'undefined') {
                FilterEvents(EVENT_ACTIVITY.ATTENDING)
            } else {
                FilterEvents(activeView)
            }
        }
    }, [events])

    function FilterEvents(view: EVENT_ACTIVITY) {
        if (view === EVENT_ACTIVITY.MY_EVENTS) {
            setFilteredEvents(events.filter((event) => event.user.id === currentUser.id))
            setActiveView(view)
        } else if (view === EVENT_ACTIVITY.ATTENDING) {
            setFilteredEvents(events.filter((event) => event.participants.map((p) => p.id).includes(currentUser?.id)))
            setActiveView(view)
        }
    }

    function OpenEditOrDeleteModal(e: any, event: Event) {
        e.stopPropagation();
        openConfirmModal(event)
    }
    confirmModalClick.subscribe({ next: (data) => EditOrDelete(data) })

    async function EditOrDelete(data: any) {
        if (data.action === 'edit') {
            navigate('/new-event', { state: { event: data.event } })
        } else if (data.action === 'delete') {
            const hasConfirmed = window.confirm(`Are you sure you want to delete ${data.event.title}?`)
            if (!hasConfirmed)
                return
            axios
                .delete(`${url}/api/event/` + data.event!.id + `/`, { headers: headers })
                .then((res) => {
                    fetchEvents()
                })
                .catch((err) => console.warn(err));
        }
    }

    function Decline(e: any, event: Event) {
        e.stopPropagation();
        const hasConfirmed = window.confirm(`Are you sure you want to decline ${event.title}?`)
        if (!hasConfirmed)
            return
        axios
            .put(`${url}api/event/${event.id}/decline/${currentUser?.id}/`, { headers: headers })
            .then((res) => {
                fetchEvents()
            })
            .catch((error) => console.warn(error));
    }

    return <div className={SStyles.container}>
        {isLoading ? <LoadingSpinner /> : ''}
        <div className={Styles.TabDiv}>
            <button onClick={() => { FilterEvents(EVENT_ACTIVITY.ATTENDING) }} className={`${Styles.Tab} ${activeView === EVENT_ACTIVITY.ATTENDING ? Styles.Active : ''}`}>Attending</button>
            <button onClick={() => { FilterEvents(EVENT_ACTIVITY.MY_EVENTS) }} className={`${Styles.Tab} ${activeView === EVENT_ACTIVITY.MY_EVENTS ? Styles.Active : ''}`}>My Events</button>
        </div>
        {(filteredEvents.length === 0 && activeView === EVENT_ACTIVITY.ATTENDING) ?
            <div className={`${SStyles.VertCenter} ${SStyles.center}`}>
                <h4>No attending events</h4>
                <p>Go to explore page to find new events</p>
            </div> : ''}
        {(filteredEvents.length === 0 && activeView === EVENT_ACTIVITY.MY_EVENTS) ?
            <div className={`${SStyles.VertCenter} ${SStyles.center}`}>
                <h4>You have no upcomming events</h4>
                <p>Create new events</p>
            </div> : ''}
        <EventItem currentUser={currentUser} events={filteredEvents} openModal={openModal} EventAction={activeView === EVENT_ACTIVITY.ATTENDING ? Decline : OpenEditOrDeleteModal} EventActionBtnText={activeView === EVENT_ACTIVITY.ATTENDING ? 'Decline' : 'Edit'} />
        {
            modalEvent ?
                <ShowEventModal modalIsOpen={modalIsOpen} setModalIsOpen={setModalIsOpen} event={modalEvent} currentUser={currentUser} />
                : ''
        }
        <ConfirmModal modalIsOpen={confirmModalIsOpen} setModalIsOpen={setConfirmModalIsOpen} confirmModalData={confirmModalData} confirmModalClick={confirmModalClick} />

    </div>
}
