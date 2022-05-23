import React, { useState, useEffect } from 'react';
import FetchCurrentUser from '../FetchCurrentUser';
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as fontawesomeIcon from '../styles/fontawesome'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { csrftoken } from '../csrftoken';
import SendEmail from '../hooks/sendEmail';
import { Template, User } from '../types';
import Styles from '../styles/css/EventForm.module.scss'
import { useNavigate } from "react-router-dom";
import HandleInvites from './HandleInvites';
import { useLocation } from 'react-router-dom';
import { Event } from '../types';
import SStyles from '../styles/css/Shared.module.scss'
import ShowEventModal from './modales/ShowEventModal';

const headers: any = { "X-CSRFTOKEN": csrftoken }


type EventFormType = {
  setNumInvites: React.Dispatch<React.SetStateAction<number>>,
  numInvites: number,
  setTemplateIsActive: any,
  formEventData: Template,
  setFormEventData: any,
  openMessageBar: any
  fetchTemplates: any
}
const EventForm = ({ setNumInvites, numInvites, setTemplateIsActive, formEventData, setFormEventData, openMessageBar, fetchTemplates }: EventFormType) => {
  const currentUser = FetchCurrentUser()
  const [myFriends, setMyFriends] = useState<User[]>([]);
  const location = useLocation();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isEditingPost, setIsEditingPost] = useState(false);



  useEffect(() => {
    if (location.state) {
      //@ts-ignore
      const event: Event = location.state.event
      setFormEventData(event)
      setNumInvites(event.invites.length)
      setIsEditingPost(true)
    }
  }, [location.state])

  function openModal() {
    setModalIsOpen(true);
  }


  function handleValidation(formData: FormData) {
    let isValid = true
    if (formData.getAll('invites').length === 0) {
      openMessageBar('error', "You must select at least one user.")
      isValid = false
    }
    return isValid
  }

  function handleSubmit(event: any) {
    event.preventDefault(event);
    const formData = new FormData(event.target)

    for (var key in formEventData.invites) {
      // @ts-ignore
      formData.append('invites', formEventData.invites[key].id);
    }
    for (var key in currentUser) {
      if (key === 'friends') // @ts-ignore
        formData.append(key, currentUser[key].map((friend) => friend.id));
      else// @ts-ignore
        formData.append(key, currentUser[key]);
    }
    if (!handleValidation(formData))
      return
    // for (let p of formData) {
    //   console.log(p[0], p[1])
    // }
    let btnIdPressed = event.nativeEvent.submitter.id
    if (btnIdPressed === 'postEventBtn') {
      axios.post(`api/events/${currentUser.id}/`, formData, { headers: headers })
        .then((res) => {
          openMessageBar(res.data.msgs)
          setFormEventData({ user: '', id: '', title: '', description: '', date: new Date(), adress_link: '', adress: '', invites: [] })
          SendEmail(formData.getAll('invites').join(','), 'eventCreated', res.data.id)
          setTemplateIsActive(0)
          setNumInvites(0)
        }).catch(errors => console.warn(errors));
    } else if (btnIdPressed === "updateEventBtn") {
      axios.put(`api/event/${formData.get('id')}/`, formData, { headers: headers })
        .then((res) => {
          openMessageBar(res.data.msgs)
          setFormEventData({ user: '', id: '', title: '', description: '', date: new Date(), adress_link: '', adress: '', invites: [] })
          setIsEditingPost(false)
          setNumInvites(0)
        }).catch(errors => console.warn(errors));
    }
    else if (btnIdPressed === 'addTemplateBtn') {
      axios.post(`api/templates/${currentUser.id}/`, formData, { headers: headers })
        .then((res) => {
          openMessageBar(res.data.msgs)
          setFormEventData({ user: '', id: '', title: '', description: '', date: new Date(), adress_link: '', adress: '', invites: [] })
          fetchTemplates()
          setNumInvites(0)
        }).catch(errors => console.warn(errors));
    }
    else if (btnIdPressed === "updatetemplatetBtn") {
      axios.put(`api/template/${formData.get('id')}/`, formData, { headers: headers })
        .then((res) => {
          openMessageBar(res.data.msgs)
          setFormEventData({ user: '', id: '', title: '', description: '', date: new Date(), adress_link: '', adress: '', invites: [] })
          fetchTemplates()
          setTemplateIsActive(0)
          setNumInvites(0)
        }).catch(errors => console.warn(errors));
    }
  }
  useEffect(() => {
    if (currentUser) {
      axios
        .get(`api/eventUsers/${currentUser.friends.map((friend) => friend.id).join(',')}/`)
        .then((res) => {
          setMyFriends(res.data)
        })
    }
  }, [currentUser])



  return (
    <div className={SStyles.container}>
      <h3 className={SStyles.center}>What are you doing today?</h3>
      <form id='eventForm' onSubmit={e => { handleSubmit(e) }}>
        <input type="hidden" name='id' value={formEventData.id} />
        <input type="hidden" name='user' value={currentUser ? currentUser.id : ''} />
        <article className={SStyles.TextInput}>
          <input required placeholder="Title" name='title' type="text" value={formEventData.title} onChange={e => { setFormEventData({ ...formEventData, [e.target.name]: e.target.value }) }} />
          <DatePicker name='date' selected={new Date(formEventData.date)} onChange={date => setFormEventData({ ...formEventData, date: date })} />
          <textarea required placeholder="Description" name='description' value={formEventData.description} onChange={e => { setFormEventData({ ...formEventData, [e.target.name]: e.target.value }) }} />
          <input required placeholder="Adress" name='adress' type="text" value={formEventData.adress} onChange={e => { setFormEventData({ ...formEventData, [e.target.name]: e.target.value }) }} />
          <input required placeholder="Adress Link" name='adress_link' type="text" value={formEventData.adress_link} onChange={e => { setFormEventData({ ...formEventData, [e.target.name]: e.target.value }) }} />
          <button className={`${SStyles.button} ${SStyles.def} w-100 mt-2 mb-2`} type='button' onClick={() => { openModal() }}>Handle invites <FontAwesomeIcon icon={fontawesomeIcon.faUserFriends} />{numInvites ? numInvites : ''}</button>
          <div className={`${SStyles.ButtonsDiv} mb-2`}>
            {isEditingPost ?
              <button id='updateEventBtn' type='submit' className={`${SStyles.button} ${SStyles.add} w-100`}>Update Event <FontAwesomeIcon icon={fontawesomeIcon.faSave} /></button>
              : <button id='postEventBtn' type='submit' className={`${SStyles.button} ${SStyles.add} w-100`}>Post Event <FontAwesomeIcon icon={fontawesomeIcon.faSave} /></button>
            }
            {(formEventData.id && !isEditingPost) ?
              <button id='updatetemplatetBtn' type='submit' className={`${SStyles.button} ${SStyles.add} w-100`}>Update Template <FontAwesomeIcon icon={fontawesomeIcon.faSave} /></button>
              : <button id='addTemplateBtn' type='submit' className={`${SStyles.button} ${SStyles.add} w-100`}>Add Template <FontAwesomeIcon icon={fontawesomeIcon.faSave} /></button>
            }
          </div>

        </article>
      </form>
      <HandleInvites modalIsOpen={modalIsOpen} setModalIsOpen={setModalIsOpen} myFriends={myFriends} formEventData={formEventData} setFormEventData={setFormEventData} setNumInvites={setNumInvites} />
    </div >
  )
}

export default EventForm