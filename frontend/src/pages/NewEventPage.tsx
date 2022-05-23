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

const headers: any = { "X-CSRFTOKEN": csrftoken }



export default function NewEventPage() {
    const [templates, setTemplates] = useState([]);
    const [numInvites, setNumInvites] = useState<number>(0);
    const { alertType, isActive, setIsActive, message, openMessageBar } = useMessageBar();
    const [templateIsActive, setTemplateIsActive] = useState<number>(0);
    const currentUser = FetchCurrentUser()
    function handleDelete(e: any, template: Template) {
        e.stopPropagation(e);
        axios
            .delete('/api/template/' + template.id + '/', { headers: headers })
            .then((res) => {
                let hasErrors = openMessageBar(res.data.msgType, res.data.msg)
                if (!hasErrors) {
                    fetchTemplates()
                    if (templateIsActive === template.id) {
                        setTemplateIsActive(0)
                        setFormEventData({ user: currentUser, id: undefined, title: '', description: '', date: new Date(), adress_link: '', adress: '', invites: [] })
                        setNumInvites(0)
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
        if (currentUser)
            fetchTemplates()
    }, [currentUser])
    const [formEventData, setFormEventData] = useState<Template>({
        user: currentUser,
        id: undefined,
        title: 'Title',
        description: 'Desc',
        date: new Date(),
        adress_link: 'https://google.com/',
        adress: 'volrat',
        invites: []
    });
    const handleEdit = (e: any, template: Template) => {
        e.stopPropagation(e);
        if (templateIsActive === template.id) {
            setFormEventData({ user: currentUser, id: undefined, title: '', description: '', date: new Date(), adress_link: '', adress: '', invites: [] })
            setNumInvites(0)
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
                <EventForm setNumInvites={setNumInvites} numInvites={numInvites} setTemplateIsActive={setTemplateIsActive} formEventData={formEventData} setFormEventData={setFormEventData} openMessageBar={openMessageBar} fetchTemplates={fetchTemplates} />
                <div className={'row'}>
                    <TemplateEventItem handleDelete={handleDelete} templateIsActive={templateIsActive} templates={templates} fetchTemplates={fetchTemplates} openMessageBar={openMessageBar} handleEdit={handleEdit} />
                </div>
            </div >
        </>
    )
}
