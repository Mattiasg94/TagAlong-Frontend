
import axios from 'axios';
import React from 'react'
import FetchCurrentUser from '../FetchCurrentUser';
import { FriendRequest, User } from '../types';
import { csrftoken } from '../csrftoken';

import {url} from '../routes';
const headers: any = { "X-CSRFTOKEN": csrftoken }


export function AcceptFriendRequest(user: User, currentUser: User) {
    const formData = new FormData()
    currentUser['friends'].push(user)
    for (var key in currentUser) {
        if (key === 'friends') // @ts-ignore
            formData.append(key, currentUser[key].map((friend) => friend.id));
        else// @ts-ignore
            formData.append(key, currentUser[key]);
    }
    axios.put(`${url}api/user/${currentUser.id}/`, formData, { headers: headers })
        .then((res) => {
            return 2
        })
        .catch(errors => console.warn(errors));
}
export function DeclineFriendRequest(user: User, myFriendRequests: FriendRequest[]) {
    const hasConfirmed = window.confirm(`Sure you want to decline ${user.full_name}`)
    if (!hasConfirmed)
        return
    const friendRequest: FriendRequest = myFriendRequests.filter(fr => fr.from_user === user.id)[0]
    axios
        .delete(`${url}api/friend-request/${friendRequest.id}/`)
        .then((res) => {
            return res
        })
        .catch((error) => console.warn(error));
}