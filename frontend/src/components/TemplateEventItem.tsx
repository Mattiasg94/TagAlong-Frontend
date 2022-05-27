import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as fontawesomeIcon from '../styles/fontawesome'
import Styles from '../styles/css/TemplateItem.module.scss'
import { Template, User } from '../types';
import ShowTemplateModal from './modales/ShowTemplateModal';
import FetchCurrentUser from '../FetchCurrentUser';
import SStyles from '../styles/css/Shared.module.scss'

type TemplateEventItemType = {
    handleDelete: any | null,
    templateIsActive: number | null,
    templates: Template[],
    handleEdit: any
}
const TemplateEventItem = ({ handleDelete, templateIsActive, templates, handleEdit }: TemplateEventItemType): JSX.Element => {
    const [modalTemplate, setModalTemplate] = useState<Template>();
    const [eventModalIsOpen, setEventModalIsOpen] = useState(false);
    const currentUser = FetchCurrentUser()

    function openTemplateModal(template: Template) {
        setEventModalIsOpen(true);
        setModalTemplate(template)
    }
    return <>{templates.map((template) => (

        <div key={`template-${template.id}`} className={`${Styles.template}`}>
            <article className={(templateIsActive === template.id ? Styles.templateIsActive : '')} onClick={() => openTemplateModal(template)} >
                <div className={Styles.info}>
                    <h6>{template.title}</h6>
                    <div>
                        <p><FontAwesomeIcon icon={fontawesomeIcon.faUserFriends} /> <b>{template.invites.length}</b></p>
                        <p><FontAwesomeIcon icon={fontawesomeIcon.faUserXmark} /> <b>{template.max_invites}</b></p>
                    </div>
                </div>
                <div className={`${SStyles.ButtonsDiv} ${Styles.ButtonsDiv}`}>
                    {handleDelete ? <button className={`${SStyles.button} ${SStyles.del} w-100`} onClick={(e) => handleDelete(e, template)}><FontAwesomeIcon icon={fontawesomeIcon.faTrashAlt} /></button> : ''}
                    <button className={`w-100 ${SStyles.button} ${SStyles.def}`} onClick={(e) => handleEdit(e, template)}>
                        {handleDelete ? <FontAwesomeIcon icon={fontawesomeIcon.faPencilAlt} /> : 'Select'}
                    </button>
                </div>
            </article>
            {
                modalTemplate ?
                    <ShowTemplateModal modalIsOpen={eventModalIsOpen} setModalIsOpen={setEventModalIsOpen} template={modalTemplate} currentUser={currentUser} />
                    : ''
            }
        </div>
    ))}</>
};
export default TemplateEventItem