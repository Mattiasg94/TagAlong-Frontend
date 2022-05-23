import React, { useState, useEffect } from 'react';
import axios from "axios";
import EventItem from '../components/EventItem';
import { MessageBar } from '../components/MessageBar/MessageBar';
import { useMessageBar } from '../components/MessageBar/useMessageBar';
import { User, Event } from '../types';
import ShowEventModal from '../components/modales/ShowEventModal';
import FetchCurrentUser from '../FetchCurrentUser';
import { csrftoken } from '../csrftoken';
import SStyles from '../styles/css/Shared.module.scss'

const headers: any = { "X-CSRFTOKEN": csrftoken }

export default function ExplorePage() {
    const [events, setEvents] = useState<Event[]>([]);
    const { alertType, isActive, setIsActive, message, openMessageBar } = useMessageBar();
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalEvent, setModalEvent] = useState<Event>();
    const currentUser = FetchCurrentUser()
    function openModal(event: Event) {
        setModalIsOpen(true);
        setModalEvent(event)
    }

    function fetchEvents() {
        axios
            .get("api/events/")
            .then((res) => {
                //@ts-ignore
                let eventsToShow = res.data.filter((event) => (event.user.id !== currentUser.id && !event.participants.map((p) => p.id).includes(currentUser.id)))
                setEvents(eventsToShow)
            })
            .catch((error) => console.warn(error));
    }
    useEffect(() => {
        if (currentUser)
            fetchEvents()
    }, [currentUser])
    function Attend(e: any, event: Event) {
        e.stopPropagation();
        axios
            .put(`api/event/${event.id}/attend/${currentUser?.id}/`, { headers: headers })
            .then((res) => {
                fetchEvents()
            })
            .catch((error) => console.warn(error));
    }
    return (
        <div className={SStyles.container}>
            <EventItem events={events} openModal={openModal} EventAction={Attend} EventActionBtnText={'Attend'} />
            {events.length ? '' :
                <div className={`${SStyles.VertCenter} ${SStyles.center}`}>
                    <h4>No Events</h4>
                    <p>Find more events by finding more friends</p>
                </div>}
            {modalEvent ?
                <ShowEventModal modalIsOpen={modalIsOpen} setModalIsOpen={setModalIsOpen} eventOrTemplate={modalEvent} currentUser={currentUser} />
                : ''}
        </div>
    )
}
