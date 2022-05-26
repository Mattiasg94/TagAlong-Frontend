import axios from "axios";
import { csrftoken } from '../csrftoken';
import React, { useState, useEffect } from 'react';
import { FriendRequest, User } from "../types";
import Styles from '../styles/css/Friends.module.scss'

const headers: any = { "X-CSRFTOKEN": csrftoken }

const API_URL = 'http://localhost:8000/';
type FriendsType = {
    filteredUsers: User[],
    currentUser: User,
    friendRequests: FriendRequest[],
    friendRequestToIds: number[],
    fetchUsers: any,
    fetchFriendRequests: any
}
const Friends = ({ filteredUsers, currentUser, friendRequests, friendRequestToIds, fetchUsers, fetchFriendRequests }: FriendsType) => {


    function RemoveFriend(user: User) {
        const hasConfirmed = window.confirm(`Sure you want to remove ${user.full_name}`)
        if (!hasConfirmed)
            return
        const formData = new FormData()
        currentUser['friends'] = currentUser['friends'].filter((friend) => { return friend.id !== user.id })
        for (var key in currentUser) {
            if (key === 'friends') // @ts-ignore
                formData.append(key, currentUser[key].map((friend) => friend.id));
            else// @ts-ignore
                formData.append(key, currentUser[key]);
        }
        // for(let pair of formData.entries()){
        //     console.log(pair[0],pair[1])
        // }
        axios.put(`api/user/${currentUser.id}/`, formData, { headers: headers })
            .then((res) => {
                fetchUsers()
            })
            .catch(errors => console.warn(errors));
    }

    function SendFriendRequest(user: User) {
        const formData = new FormData()
        formData.append('from_user', currentUser.id.toString())
        formData.append('to_user', user.id.toString())
        axios.post("api/friend-request/", formData, { headers: headers })
            .then((res) => {
                fetchFriendRequests()
            })
            .catch(errors => console.warn(errors));
    }
    function RemoveFriendRequest(user: User) {
        let friendRequestId = friendRequests.filter((v, i, a) => { return v['to_user'] === user.id })[0]['id']
        axios.delete(`api/friend-request/${friendRequestId}/`, { headers: headers })
            .then((res) => {
                fetchFriendRequests()
            })
            .catch(errors => console.warn(errors));
    }
    function renderFriends() {
        return filteredUsers.map((user) => (
            <div key={`friends-user-${user.id}`} className={Styles.user}>
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
                                <td className={Styles.buttonTd} style={{ display: currentUser.friends.map((friend) => friend.id).includes(user.id) ? '' : 'none' }}>
                                    <button onClick={() => RemoveFriend(user)} className={Styles.remove}>Remove</button>
                                </td>
                                <td className={Styles.buttonTd} style={{ display: (!currentUser.friends.map((friend) => friend.id).includes(user.id) && !friendRequestToIds.includes(user.id)) ? '' : 'none' }} >
                                    <button onClick={() => SendFriendRequest(user)} className={Styles.add}>Follow</button>
                                </td>
                                <td className={Styles.buttonTd} style={{ display: friendRequestToIds.includes(user.id) ? '' : 'none' }} >
                                    <button onClick={() => RemoveFriendRequest(user)} className={Styles.def} >Pending</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </article>
            </div>
        ))
    }
    return (
        <>
            {renderFriends()}
        </>
    )
};
export default Friends