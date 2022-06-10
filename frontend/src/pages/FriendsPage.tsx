import React, { useState, useEffect } from 'react';
import axios from "axios";
import FetchCurrentUser from '../FetchCurrentUser';
import MyFriendRequests from '../components/MyFriendRequests';
import Friends from '../components/Friends';
import FilterUsers from '../components/FilterUsers';
import { FriendRequest, User } from '../types';
import SStyles from '../styles/css/Shared.module.scss'
import LoadingSpinner from '../hooks/LoadingSpinner';

import {url} from '../routes';

const FriendsPage = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [users, setUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
    const [friendRequestToIds, setFriendRequestToIds] = useState<number[]>([]);//TODO fix so i dont need this one
    const currentUser = FetchCurrentUser()
    function fetchFriendRequests() {
        axios
            //@ts-ignore
            .get(`${url}api/friend-request/${currentUser.id}/from_user/`)
            .then((res) => {
                //@ts-ignore
                setFriendRequestToIds(res.data.map(req => req.to_user))
                setFriendRequests(res.data)
            })
            .catch((error) => console.warn(error));
    }
    function fetchUsers() {
        axios
            .get(`${url}api/allUsers/`)
            .then((res) => {
                setUsers(res.data)
                //@ts-ignore
                setFilteredUsers(res.data.filter(user => currentUser.friends.map((friend) => friend.id).includes(user.id)))
                setIsLoading(false)
            })
            .catch((error) => console.warn(error));
    }
    useEffect(() => {
        if (currentUser) {
            fetchUsers()
            fetchFriendRequests()
        }
    }, [currentUser])

    return (
        <div className={SStyles.container}>
            {isLoading ? <LoadingSpinner /> : ''}
            <MyFriendRequests users={users} currentUser={currentUser} fetchFriendRequests={fetchFriendRequests} fetchUsers={fetchUsers} />
            {(friendRequests.length === 0) ?
                <div className={`${SStyles.center} mt-2`}>
                    <h4>No friend Reguests</h4>
                </div> : ''}
            <FilterUsers users={users} setFilteredUsers={setFilteredUsers} currentUser={currentUser} />
            <Friends filteredUsers={filteredUsers} currentUser={currentUser} friendRequests={friendRequests} friendRequestToIds={friendRequestToIds} fetchUsers={fetchUsers} fetchFriendRequests={fetchFriendRequests} />
        </div>
    )
};
export default FriendsPage
