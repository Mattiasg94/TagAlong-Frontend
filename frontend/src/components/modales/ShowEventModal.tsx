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

const headers: any = { "X-CSRFTOKEN": csrftoken }

type ShowEventModalType = {
    modalIsOpen: any,
    setModalIsOpen: any,
    eventOrTemplate: Event | Template,
    currentUser: User
}
const ShowEventModal = ({ modalIsOpen, setModalIsOpen, eventOrTemplate, currentUser }: ShowEventModalType) => {
    const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
    useEffect(() => {
        fetchFriendRequests()
    })
    function afterOpenModal() {
        //@ts-ignore
    }
    function closeModal() {
        setModalIsOpen(false);
    }
    function fetchFriendRequests() {
        axios
            .get(`api/friend-request/${currentUser.id}/from_user/`)
            .then((res) => {
                setFriendRequests(res.data)
            })
            .catch((error) => console.warn(error));
    }
    function SendFriendRequest(user: User) {
        const formData = new FormData()
        formData.append('from_user', currentUser.id.toString())
        formData.append('to_user', user.id.toString())
        axios.post("api/friend-request/", formData, { headers: headers })
            .then((res) => {
            })
            .catch(errors => console.warn(errors));
    }
    function RemoveFriendRequest(user: User) {
        let friendRequestId = friendRequests.filter((v, i, a) => { return v['to_user'] === user.id })[0]['id']
        axios.delete(`api/friend-request/${friendRequestId}/`, { headers: headers })
            .then((res) => {
            })
            .catch(errors => console.warn(errors));
    }
    function renderUsers(users: User[]) {
        return users.map((user) => (
            <div key={user.id} className={Styles.user}>
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
                    <a target="_blank" href={eventOrTemplate.adress_link}><p>{eventOrTemplate.adress}</p></a>
                    <h2>{eventOrTemplate.title}</h2>
                    <div className={`${Styles.flowRoot} mb-3`}>
                        <p className={Styles.name}>{eventOrTemplate.user.username} {eventOrTemplate.user.full_name}</p>
                        {('participants' in eventOrTemplate) ?
                            <p className={Styles.date}>{formatDate(eventOrTemplate.date)}</p> : ''}
                    </div>
                    <div className='mb-3'>
                        <p>{eventOrTemplate.description}</p>
                    </div>
                </div>
                {('participants' in eventOrTemplate) ? eventOrTemplate.participants.length === 0 ?
                    <h3 className={SStyles.center}>No participants</h3>
                    :
                    <><h3 className={SStyles.center}>Participants</h3>
                        {/* @ts-ignore */}
                        {renderUsers(eventOrTemplate.participants)}</> : ''}
                <h3 className={SStyles.center}>Invites</h3>
                {/* @ts-ignore */}
                {renderUsers(eventOrTemplate.invites)}
                <button className={`${Styles.closeBtn} ${Styles.button} ${Styles.def}`} onClick={closeModal}>close</button>
            </Modal>
        </div>
    )
}

export default ShowEventModal