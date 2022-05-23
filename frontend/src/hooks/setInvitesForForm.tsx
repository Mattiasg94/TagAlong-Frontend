import React from 'react'
import { Template, User } from '../types';

const setInvitesForForm = (myFriends: User[], formEventData: Template, invite: User, adduser = false) => {
    let invites = formEventData.invites
    if (adduser) {
        invites.push(invite)
    } else {
        invites = invites.filter(item => item.id !== invite.id)
    }
    // invites.map((invite) => invite.id).includes(invite.id) ? invites = invites.filter(item => item.id !== invite.id)
    //     : invites.push(myFriends.filter((f) => f.id === invite.id)[0])
    return invites
}

export default setInvitesForForm;