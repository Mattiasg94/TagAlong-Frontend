import { csrftoken } from '../csrftoken';
import React, { useState, useEffect } from 'react';
import {  User } from "../types";
import {useLocation} from 'react-router-dom';



const FriendProfile = () => {
    const location = useLocation();
    // @ts-ignore
    const user:User=location.state.user

    return (
        <>
        <p>{user.full_name}</p>
        </>
    )
};
export default FriendProfile