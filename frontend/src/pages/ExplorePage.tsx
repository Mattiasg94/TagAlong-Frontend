import React, { useState, useEffect } from 'react';
import axios from "axios";
import EventItem from '../components/EventItem';
import { MessageBar } from '../components/MessageBar/MessageBar';
import { useMessageBar } from '../components/MessageBar/useMessageBar';
import { User, Event, Template } from '../types';
import ShowEventModal from '../components/modales/ShowEventModal';
import FetchCurrentUser from '../FetchCurrentUser';
import { csrftoken } from '../csrftoken';
import SStyles from '../styles/css/Shared.module.scss'
import LoadingSpinner from '../hooks/LoadingSpinner';
import ChooseTemplateForEventShare from '../components/modales/ChooseTemplateForEventShare';
import { Subject } from 'rxjs';
import {url} from '../routes';

const headers: any = { "X-CSRFTOKEN": csrftoken }

export default function ExplorePage() {
    const [isLoading, setIsLoading] = useState(true);
    const [events, setEvents] = useState<Event[]>([]);
    const { alertType, isActive, setIsActive, message, openMessageBar } = useMessageBar();
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalEvent, setModalEvent] = useState<Event>();
    const currentUser = FetchCurrentUser()
    let confirmModalClick = new Subject()
    const [confirmModalIsOpen, setConfirmModalIsOpen] = useState(false);
    const [confirmModalData, setConfirmModalData] = useState<Event>();
    function openConfirmModal(e: any, event: Event) {
        e.stopPropagation();
        setConfirmModalIsOpen(true);
        setConfirmModalData(event)
    }
    confirmModalClick.subscribe({ next: (data) => ChooseTemplate(data) })
    function ChooseTemplate(data: any) {
        if (data.action == 'all') {
            Attend(data.event, 0)
        } else if (data.action == 'subset') {
            Attend(data.event, data.template.id)
        }
    }
    function openModal(event: Event) {
        setModalIsOpen(true);
        setModalEvent(event)
    }
    function fetchEvents() {
        axios
            .get(`${url}api/events/${currentUser.id}/explore/`)
            .then((res) => {
                //@ts-ignore
                let eventsToShow = res.data.filter((event) => (event.user.id !== currentUser.id && !event.participants.map((p) => p.id).includes(currentUser.id)))
                setEvents(eventsToShow)
                setIsLoading(false)
            })
            .catch((error) => console.warn(error));
    }
    useEffect(() => {
        if (currentUser)
            fetchEvents()
    }, [currentUser])
    function Attend(event: Event, templateId: number) {
        axios
            .put(`${url}api/event/${event.id}/attend/${currentUser?.id}/${templateId}/`, { headers: headers })
            .then((res) => {
                fetchEvents()
            })
            .catch((error) => console.warn(error));
    }
    return (
        <div className={SStyles.container}>
            {isLoading ? <LoadingSpinner /> : ''}
            <EventItem currentUser={currentUser} events={events} openModal={openModal} EventAction={openConfirmModal} EventActionBtnText={'Attend'} />
            {(events.length === 0 && !isLoading) ?
                <div className={`${SStyles.VertCenter} ${SStyles.center}`}>
                    <h4>No Events</h4>
                    <p>Find more events by finding more friends</p>
                </div> : ''}
            {modalEvent ?
                <ShowEventModal modalIsOpen={modalIsOpen} setModalIsOpen={setModalIsOpen} event={modalEvent} currentUser={currentUser} />
                : ''}
            <ChooseTemplateForEventShare modalIsOpen={confirmModalIsOpen} setModalIsOpen={setConfirmModalIsOpen} event={confirmModalData!} confirmModalClick={confirmModalClick} />
        </div>
    )
}
