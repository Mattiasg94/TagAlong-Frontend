import React, { useState, useEffect } from 'react';
import "react-datepicker/dist/react-datepicker.css";
import { Template, User } from '../types';
import Styles from '../styles/css/HandleInvites.module.scss'
import SStyles from '../styles/css/Shared.module.scss'
import Modal from 'react-modal';



type HandleInvitesType = {
    currentUser: User
    modalIsOpen: any,
    setModalIsOpen: any,
    myFriends: User[],
    formEventData: Template,
    setFormEventData: any,
    setNumInvites: any,

}
const HandleInvites = ({ currentUser, modalIsOpen, setModalIsOpen, myFriends, formEventData, setFormEventData, setNumInvites }: HandleInvitesType) => {

    function afterOpenModal() {
    }
    function closeModal() {
        setModalIsOpen(false);
    }

    function SetInvites(invite: User, addInvite = false) {
        let invites = formEventData.invites
        if (addInvite) {
            invites.push(invite)
        } else {
            invites = invites.filter(item => item.id !== invite.id)
        }
        setNumInvites(invites.length)
        setFormEventData({ ...formEventData, invites: invites })
    }

    function renderUsers() {
        return myFriends.map((friend) => (
            <div key={`handleInvites-friend-${friend.id}`} className={Styles.user}>
                <article >
                    <table>
                        <tbody>
                            <tr>
                                <td className={Styles.field}>
                                    {friend.username}
                                </td>
                                <td className={Styles.field}>
                                    {friend.full_name}
                                </td>
                                <td className={Styles.buttonTd} style={{ display: formEventData.invites.map((i) => i.id).includes(friend?.id!) ? 'none' : '' }}>
                                    <button className={Styles.add} onClick={() => { SetInvites(friend, true) }}>Add</button>
                                </td>
                                <td className={Styles.buttonTd} style={{ display: !formEventData.invites.map((i) => i.id).includes(friend?.id!) ? 'none' : '' }}>
                                    <button className={Styles.del} onClick={() => { SetInvites(friend) }} disabled={currentUser.id === friend.id}>Remove</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </article>
            </div >
        ))
    }

    return (

        <Modal
            className={Styles.Modal}
            overlayClassName={Styles.Overlay}
            ariaHideApp={false}
            isOpen={modalIsOpen}
            onAfterOpen={afterOpenModal}
            onRequestClose={closeModal}
            // style={customStyles}
            contentLabel="Example Modal">
            <div className={SStyles.container}>
                <h2 className={SStyles.center}>Choose friends</h2>
                {renderUsers()}
                <button className={`${Styles.closeBtn} ${SStyles.button} ${SStyles.def}`} onClick={closeModal}>close</button>
            </div>
        </Modal>

    )
}

export default HandleInvites