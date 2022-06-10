import React, { useEffect, useState } from 'react';
import "react-datepicker/dist/react-datepicker.css";
import { User, Event, Template, FriendRequest } from '../../types';
import Styles from '../../styles/css/ShowEventModel.module.scss'
import Modal from 'react-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as fontawesomeIcon from '../../styles/fontawesome'
import formatDate from '../../hooks/formatDate';
import SStyles from '../../styles/css/Shared.module.scss'
import { csrftoken } from '../../csrftoken';
import axios from 'axios';

import {url} from '../../routes';
const headers: any = { "X-CSRFTOKEN": csrftoken }

type ShowTemplateModalType = {
    modalIsOpen: any,
    setModalIsOpen: any,
    template: Template,
    currentUser: User
}
const ShowTemplateModal = ({ modalIsOpen, setModalIsOpen, template, currentUser }: ShowTemplateModalType) => {
    const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
    useEffect(() => {
        fetchFriendRequests()
    }, [currentUser]) // to prevent from fireing endlessly, but currentUser makes no sence, change to something else
    function afterOpenModal() {
        //@ts-ignore
    }
    function closeModal() {
        setModalIsOpen(false);
    }
    function fetchFriendRequests() {
        axios
            .get(`${url}api/friend-request/${currentUser.id}/from_user/`)
            .then((res) => {
                setFriendRequests(res.data)
            })
            .catch((error) => console.warn(error));
    }
    function SendFriendRequest(user: User) {
        const formData = new FormData()
        formData.append('from_user', currentUser.id.toString())
        formData.append('to_user', user.id.toString())
        axios.post(`${url}api/friend-request/`, formData, { headers: headers })
            .then((res) => {
            })
            .catch(errors => console.warn(errors));
    }
    function RemoveFriendRequest(user: User) {
        let friendRequestId = friendRequests.filter((v, i, a) => { return v['to_user'] === user.id })[0]['id']
        axios.delete(`${url}api/friend-request/${friendRequestId}/`, { headers: headers })
            .then((res) => {
            })
            .catch(errors => console.warn(errors));
    }
    function renderUsers(users: User[]) {
        return users.map((user) => (
            <div key={`showTemplate-user-${user.id}`} className={Styles.user}>
                <article >
                    <table>
                        <tbody>
                            <tr>
                                <td className={Styles.field}>
                                    {user.username}
                                </td>
                                <td className={Styles.field}>
                                    {user.full_name}
                                </td>
                                {currentUser.friends.map((friend) => friend.id).includes(user.id) ?
                                    < td className={Styles.friendTr}>
                                        <FontAwesomeIcon icon={fontawesomeIcon.faUserFriends} />
                                    </td> :
                                    <>
                                        <td className={Styles.buttonTd} style={{ display: (!currentUser.friends.map((friend) => friend.id).includes(user.id) && !friendRequests.map((req) => req.to_user).includes(user.id)) ? '' : 'none' }} >
                                            <button onClick={() => SendFriendRequest(user)} className={Styles.add}>Follow</button>
                                        </td>
                                        <td className={Styles.buttonTd} style={{ display: friendRequests.map((req) => req.to_user).includes(user.id) ? '' : 'none' }} >
                                            <button onClick={() => RemoveFriendRequest(user)} className={Styles.def} >Pending</button>
                                        </td>
                                    </>
                                }
                            </tr>
                        </tbody>
                    </table>
                </article>
            </div >
        ))
    }
    return (
        <div className={SStyles.container}>
            <Modal
                className={Styles.Modal}
                overlayClassName={Styles.Overlay}
                ariaHideApp={false}
                isOpen={modalIsOpen}
                onAfterOpen={afterOpenModal}
                onRequestClose={closeModal}
                contentLabel="Example Modal"
            >
                <div className={Styles.info}>
                    <a target="_blank" href={template.adress_link}><p>{template.adress}</p></a>
                    <h2>{template.title}</h2>
                    <div className={`${Styles.flowRoot} mb-3`}>
                        <p className={SStyles.center}>{template.user.username} {template.user.full_name}</p>
                    </div>
                    <div className='mb-3'>
                        <p>{template.description}</p>
                    </div>
                </div>
                <h3 className={SStyles.center}>Invites</h3>
                {/* @ts-ignore */}
                {renderUsers(template.invites.filter((i) => !template.participants?.map((p) => p.id).includes(i.id)))}
                <button className={`${Styles.closeBtn} ${Styles.button} ${Styles.def}`} onClick={closeModal}>close</button>
            </Modal>
        </div>
    )
}

export default ShowTemplateModal