import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as fontawesomeIcon from '../styles/fontawesome'
import Styles from '../styles/css/TemplateItem.module.scss'
import { Template, User } from '../types';
import ShowEventModal from './modales/ShowEventModal';
import FetchCurrentUser from '../FetchCurrentUser';
import SStyles from '../styles/css/Shared.module.scss'

type TemplateEventItemType = {
    handleDelete: any,
    templateIsActive: number,
    templates: Template[],
    fetchTemplates: any,
    openMessageBar: any,
    handleEdit: any
}
const TemplateEventItem = ({ handleDelete, templateIsActive, templates, fetchTemplates, openMessageBar, handleEdit }: TemplateEventItemType): JSX.Element => {
    const [modalTemplate, setModalTemplate] = useState<Template>();
    const [eventModalIsOpen, setEventModalIsOpen] = useState(false);
    const currentUser = FetchCurrentUser()

    function openTemplateModal(template: Template) {
        setEventModalIsOpen(true);
        setModalTemplate(template)
    }

    return <>{templates.map((template) => (

        <div key={template.id} className={`${Styles.template} col-6`}>
            <article className={(templateIsActive === template.id ? Styles.templateIsActive : '')} onClick={() => openTemplateModal(template)} >
                <div className={Styles.info}>
                    <h6>{template.title}</h6>
                    <p><FontAwesomeIcon icon={fontawesomeIcon.faUserFriends} /> <b>{template.invites.length}</b></p>
                </div>
                <div className={`${SStyles.ButtonsDiv} ${Styles.ButtonsDiv}`}>
                    <button className={`${SStyles.button} ${SStyles.remove} w-100`} onClick={(e) => handleDelete(e, template)}><FontAwesomeIcon icon={fontawesomeIcon.faTrashAlt} /></button>
                    <button className={`w-100 ${SStyles.button} ${SStyles.def}`} onClick={(e) => handleEdit(e, template)}><FontAwesomeIcon icon={fontawesomeIcon.faPencilAlt} /></button>
                </div>
            </article>
            {
                modalTemplate ?
                    <ShowEventModal modalIsOpen={eventModalIsOpen} setModalIsOpen={setEventModalIsOpen} eventOrTemplate={modalTemplate} currentUser={currentUser} />
                    : ''
            }
        </div>
    ))}</>
};
export default TemplateEventItem