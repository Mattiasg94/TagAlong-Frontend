import React, { useState } from 'react';
import "react-datepicker/dist/react-datepicker.css";
import Styles from '../../styles/css/ChooseTemplateForEventShare.module.scss'
import SStyles from '../../styles/css/Shared.module.scss'
import Modal from 'react-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as fontawesomeIcon from '../../styles/fontawesome'
import { Subject } from 'rxjs';
import TemplateEventItem from '../TemplateEventItem';
import axios from 'axios';
import FetchCurrentUser from '../../FetchCurrentUser';
import { Template, Event } from '../../types';

type ChooseTemplateForEventShareType = {
    modalIsOpen: any,
    setModalIsOpen: any,
    event: Event
    confirmModalClick: Subject<unknown>
}
const ChooseTemplateForEventShare = ({ modalIsOpen, setModalIsOpen, event, confirmModalClick }: ChooseTemplateForEventShareType) => {
    const [templates, setTemplates] = useState([])
    const currentUser = FetchCurrentUser()
    function afterOpenModal() {
        fetchTemplates()
    }
    function fetchTemplates() {
        axios
            .get(`api/templates/${currentUser.id}/`)
            .then((res) => {
                setTemplates(res.data)
            })
            .catch((error) => console.warn(error));
    }
    function handleModalAction(e: any, template: Template) {
        e.stopPropagation(e)
        setModalIsOpen(false);
        confirmModalClick.next({ action: 'subset', template: template, event: event })
    }
    function ShareToAll(e: any) {
        e.stopPropagation(e)
        setModalIsOpen(false);
        confirmModalClick.next({ action: 'all', event: event })
    }

    function closeModal() {
        setModalIsOpen(false);
    }

    return (
        <div>
            <Modal
                className={Styles.Modal}
                overlayClassName={Styles.Overlay}
                ariaHideApp={false}
                isOpen={modalIsOpen}
                onAfterOpen={afterOpenModal}
                onRequestClose={closeModal}
                contentLabel="Example Modal"
            >
                <div className={SStyles.container}>
                    <h3 className={`${SStyles.center} mb-4 mt-3`}>Who do you want to share to?</h3>

                </div>
                <div className={SStyles.TemplateRowContainer}>
                    <TemplateEventItem templates={templates} handleDelete={undefined} templateIsActive={null} handleEdit={handleModalAction} />
                </div>
                <div className={SStyles.ButtonsDiv}>
                    <button className={`${SStyles.button} ${SStyles.def}`} onClick={closeModal}>Close</button>
                    <button className={`${SStyles.button} ${SStyles.add}`} onClick={(e) => { ShareToAll(e) }}>All</button>
                </div>
            </Modal>
        </div>
    )
}

export default ChooseTemplateForEventShare