import React from 'react';
import { User } from '../types';

type FilterUsersType = {
    users: User[],
    setFilteredUsers: any
    currentUser: User
}
const FilterUsers = ({ users, setFilteredUsers, currentUser }: FilterUsersType) => {

    function SearchUsers(e: any) {
        let searchValue: string = e.target.value
        let filteredUsers = users.filter(user => {
            const arr = searchValue.split(' ').filter((str) => { return str !== '' });
            return arr.some(el => user.first_name.toLowerCase().includes(el)
                || user.last_name.toLowerCase().includes(el)
                || user.username.toLowerCase().includes(el)
            );
        })
        if (!searchValue) {
            filteredUsers = users.filter(user => currentUser.friends.map((friend) => friend.id).includes(user.id))
        }
        setFilteredUsers(filteredUsers)
    }
    return (
        <div className='mb-1'>
            <input className='form-control' placeholder='Search User' onChange={(e) => SearchUsers(e)} type="text" />
        </div>
    )
}
export default FilterUsers