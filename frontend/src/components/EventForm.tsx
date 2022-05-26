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

const headers: any = { "X-CSRFTOKEN": csrftoken }

enum FORM_BTN {
  POST_EVENT = 'POST_EVENT',
  UPDATE_EVENT = 'UPDATE_EVENT',
  ADD_TEMPLATE = 'ADD_TEMPLATE',
  UPDATE_TEMPLATE = 'UPDATE_TEMPLATE',
}

type EventFormType = {
  INITIAL_FORM_STATE: Template
  setNumInvites: React.Dispatch<React.SetStateAction<number>>,
  numInvites: number,
  setTemplateIsActive: any,
  formEventData: Template,
  setFormEventData: any,
  openMessageBar: any
  fetchTemplates: any
}
const EventForm = ({ INITIAL_FORM_STATE, setNumInvites, numInvites, setTemplateIsActive, formEventData, setFormEventData, openMessageBar, fetchTemplates }: EventFormType) => {
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
    if (formData.getAll('invites').length === 1) {
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
    let btnIdPressed = event.nativeEvent.submitter.id
    if (!handleValidation(formData))
      return
    // for (let p of formData) {
    //   console.log(p[0], p[1])
    // }

    if (btnIdPressed === FORM_BTN.POST_EVENT) {
      axios.post(`api/events/${currentUser.id}/`, formData, { headers: headers })
        .then((res) => {
          openMessageBar(res.data.msgType, res.data.msg)
          setFormEventData(INITIAL_FORM_STATE)
          SendEmail(formData.getAll('invites').join(','), 'eventCreated', res.data.id)
          setTemplateIsActive(0)
          setNumInvites(1)
        }).catch(errors => console.warn(errors));
    } else if (btnIdPressed === FORM_BTN.UPDATE_EVENT) {
      axios.put(`api/event/${formData.get('id')}/`, formData, { headers: headers })
        .then((res) => {
          openMessageBar(res.data.msgType, res.data.msg)
          setFormEventData(INITIAL_FORM_STATE)
          setIsEditingPost(false)
          setNumInvites(1)
        }).catch(errors => console.warn(errors));
    }
    else if (btnIdPressed === FORM_BTN.ADD_TEMPLATE) {
      axios.post(`api/templates/${currentUser.id}/`, formData, { headers: headers })
        .then((res) => {
          openMessageBar(res.data.msgType, res.data.msg)
          setFormEventData(INITIAL_FORM_STATE)
          fetchTemplates()
          setNumInvites(1)
        }).catch(errors => console.warn(errors));
    }
    else if (btnIdPressed === FORM_BTN.UPDATE_TEMPLATE) {
      axios.put(`api/template/${formData.get('id')}/`, formData, { headers: headers })
        .then((res) => {
          openMessageBar(res.data.msgType, res.data.msg)
          setFormEventData(INITIAL_FORM_STATE)
          fetchTemplates()
          setTemplateIsActive(0)
          setNumInvites(1)
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

  function bajs(e: any) {
    setFormEventData({ ...formEventData, max_invites: e!.target.checked ? formEventData.invites.length : '' })
  }

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
          <div className={`${Styles.MaxNumberBtnInputContainer}`} >
            <div className={`${SStyles.ckButton}`}>
              <label>
                <input onChange={(e) => { bajs(e) }} type="checkbox" /><span>Private</span>
              </label>
            </div>
            <input required placeholder="Max invites" name='max_invites' type="number" value={formEventData.max_invites} onChange={e => { setFormEventData({ ...formEventData, [e.target.name]: e.target.value }) }} />
          </div>
          <button className={`${SStyles.button} ${SStyles.def} w-100 mt-2 mb-2`} type='button' onClick={() => { openModal() }}>Handle invites <FontAwesomeIcon icon={fontawesomeIcon.faUserFriends} />{numInvites ? numInvites : ''}</button>
          <div className={`${SStyles.ButtonsDiv} mb-2`}>
            {isEditingPost ?
              <button id={FORM_BTN.UPDATE_EVENT} type='submit' className={`${SStyles.button} ${SStyles.add} w-100`}>Update Event <FontAwesomeIcon icon={fontawesomeIcon.faSave} /></button>
              : <button id={FORM_BTN.POST_EVENT} type='submit' className={`${SStyles.button} ${SStyles.add} w-100`}>Post Event <FontAwesomeIcon icon={fontawesomeIcon.faSave} /></button>
            }
            {(formEventData.id && !isEditingPost) ?
              <button id={FORM_BTN.UPDATE_TEMPLATE} type='submit' className={`${SStyles.button} ${SStyles.add} w-100`}>Update Template <FontAwesomeIcon icon={fontawesomeIcon.faSave} /></button>
              : <button id={FORM_BTN.ADD_TEMPLATE} type='submit' className={`${SStyles.button} ${SStyles.add} w-100`}>Add Template <FontAwesomeIcon icon={fontawesomeIcon.faSave} /></button>
            }
          </div>

        </article>
      </form>
      <HandleInvites currentUser={currentUser} modalIsOpen={modalIsOpen} setModalIsOpen={setModalIsOpen} myFriends={myFriends} formEventData={formEventData} setFormEventData={setFormEventData} setNumInvites={setNumInvites} />
    </div >
  )
}

export default EventForm