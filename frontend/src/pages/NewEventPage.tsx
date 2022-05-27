import React, { useState, useEffect } from 'react'
import EventForm from '../components/EventForm';
import TemplateEventItem from '../components/TemplateEventItem';
import axios from "axios";
import { MessageBar } from '../components/MessageBar/MessageBar';
import { useMessageBar } from '../components/MessageBar/useMessageBar';
import Styles from '../styles/css/NewEventPage.module.scss'
import { User, Template } from '../types';
import FetchCurrentUser from '../FetchCurrentUser';
import { csrftoken } from '../csrftoken';
import SStyles from '../styles/css/Shared.module.scss'


const headers: any = { "X-CSRFTOKEN": csrftoken }

let INITIAL_FORM_STATE: Template

export default function NewEventPage() {
    const [templates, setTemplates] = useState([]);
    const [numInvites, setNumInvites] = useState<number>(1);
    const { alertType, isActive, setIsActive, message, openMessageBar } = useMessageBar();
    const [templateIsActive, setTemplateIsActive] = useState<number>(0);
    const currentUser = FetchCurrentUser()
    const [formEventData, setFormEventData] = useState<Template>()
    function handleDelete(e: any, template: Template) {
        e.stopPropagation(e);
        const hasConfirmed = window.confirm(`Sure you want to remove ${template.title}. If you have used this event to invite people to another friends event you will invite ALL your friends to that event instead.`)
        if (!hasConfirmed)
            return
        axios
            .delete('/api/template/' + template.id + '/', { headers: headers })
            .then((res) => {
                let hasErrors = openMessageBar(res.data.msgType, res.data.msg)
                if (!hasErrors) {
                    fetchTemplates()
                    if (templateIsActive === template.id) {
                        setTemplateIsActive(0)
                        setFormEventData(INITIAL_FORM_STATE)
                        setNumInvites(1)
                    }
                }
            })
            .catch((error) => console.warn(error));

    };

    function fetchTemplates() {
        axios
            .get(`api/templates/${currentUser.id}/`)
            .then((res) => {
                setTemplates(res.data)
            })
            .catch((error) => console.warn(error));
    }
    useEffect(() => {
        if (currentUser) {
            INITIAL_FORM_STATE = {
                user: currentUser, id: undefined, title: 'Title', description: 'Description', date: new Date(),
                adress_link: 'https://google.com', adress: 'Adress', invites: [currentUser], max_invites: 0
            }
            fetchTemplates()
            setFormEventData(INITIAL_FORM_STATE);
        }
    }, [currentUser])

    const handleEdit = (e: any, template: Template) => {
        e.stopPropagation(e);
        if (templateIsActive === template.id) {
            setFormEventData(INITIAL_FORM_STATE)
            setNumInvites(1)
        }
        else {
            let invites = template.invites!.map((invite) => invite)
            setFormEventData({ ...template, invites: invites })
            setNumInvites(invites.length)
        }
        templateIsActive === template.id ? setTemplateIsActive(0) : setTemplateIsActive(template.id!)
    };
    return (
        <>
            <div className={Styles.container}>
                <MessageBar isActive={isActive} setIsActive={setIsActive} message={message} alertType={alertType} />
                {formEventData ?
                    <EventForm INITIAL_FORM_STATE={INITIAL_FORM_STATE} setNumInvites={setNumInvites} numInvites={numInvites} setTemplateIsActive={setTemplateIsActive} formEventData={formEventData} setFormEventData={setFormEventData} openMessageBar={openMessageBar} fetchTemplates={fetchTemplates} />
                    : ''}
                <div className={SStyles.TemplateRowContainer}>
                    <TemplateEventItem handleDelete={handleDelete} templateIsActive={templateIsActive} templates={templates} handleEdit={handleEdit} />
                </div>
            </div >
        </>
    )
}
