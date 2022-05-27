import React, { useState, useEffect } from 'react';
import axios from "axios";
import { csrftoken } from '../csrftoken';
import { User, FriendRequest } from '../types';
import Styles from '../styles/css/MyFriendRequests.module.scss'
import SStyles from '../styles/css/Shared.module.scss'

const headers: any = { "X-CSRFTOKEN": csrftoken }

const API_URL = 'http://localhost:8000/';
type MyFriendRequestsType = {
    users: User[],
    currentUser: User,
    fetchFriendRequests: any
    fetchUsers: any
}
const MyFriendRequests = ({ users, currentUser, fetchFriendRequests, fetchUsers }: MyFriendRequestsType) => {
    const [myFriendRequests, setMyFriendRequests] = useState<FriendRequest[]>([]);

    function fetchMyFriendRequests() {
        axios
            .get(API_URL + `api/friend-request/${currentUser.id}/to_user/`)
            .then((res) => {
                setMyFriendRequests(res.data)
            })
            .catch((error) => console.warn(error));
    }
    useEffect(() => {
        if (currentUser) {
            fetchMyFriendRequests()
        }
    }, [currentUser])
    function AcceptFriendRequest(user: User) {
        const formData = new FormData()
        currentUser['friends'].push(user)
        for (var key in currentUser) {
            if (key === 'friends') // @ts-ignore
                formData.append(key, currentUser[key].map((friend) => friend.id));
            else// @ts-ignore
                formData.append(key, currentUser[key]);
        }
        axios.put(API_URL + `api/user/${currentUser.id}/`, formData, { headers: headers })
            .then((res) => {
                fetchFriendRequests()
                fetchMyFriendRequests()
                fetchUsers()
            })
            .catch(errors => console.warn(errors));
    }
    function DeclineFriendRequest(user: User) {
        const hasConfirmed = window.confirm(`Sure you want to decline ${user.full_name}`)
        if (!hasConfirmed)
            return
        const friendRequest: FriendRequest = myFriendRequests.filter(fr => fr.from_user === user.id)[0]
        axios
            .delete(API_URL + `api/friend-request/${friendRequest.id}/`)
            .then((res) => {
                setMyFriendRequests(myFriendRequests.filter(fr => fr.from_user !== user.id))
            })
            .catch((error) => console.warn(error));
    }
    function renderMyFriendRequests() {
        let usersThatSentFriendRequest = users.filter((user) => { return myFriendRequests.map(fr => fr.from_user).includes(user.id) })
        return usersThatSentFriendRequest.map((user) => (
            <div className={Styles.user} key={`friendRequest-user-${user.id}`}>
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
                                <td className={Styles.buttonTd}>
                                    <button className={Styles.del} onClick={() => DeclineFriendRequest(user)}  >Decline</button>
                                    <button className={Styles.add} onClick={() => AcceptFriendRequest(user)}>Accept</button>
                                </td>
                                {/* <td className={Styles.buttonTd}>
                                    <button className={Styles.add} onClick={() => AcceptFriendRequest(user)}>Accept</button>
                                </td> */}
                            </tr>
                        </tbody>
                    </table>
                </article>
            </div>
        ))
    }
    return (
        <div className={SStyles.container}>
            {renderMyFriendRequests()}
        </div>
    )
};
export default MyFriendRequests