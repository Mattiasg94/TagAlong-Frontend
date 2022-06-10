import React, { useEffect, useState } from "react";
import FetchCurrentUser from "../FetchCurrentUser";
import { useFormik } from "formik";
import { csrftoken } from "../csrftoken";
import * as Yup from "yup";
import axios from "axios";
import { User } from "../types";
import SStyles from '../styles/css/Shared.module.scss'
import { useMessageBar } from "../components/MessageBar/useMessageBar";
import { MessageBar } from "../components/MessageBar/MessageBar";

import {url} from '../routes';
const headers: any = { "X-CSRFTOKEN": csrftoken }

const Profile = () => {
  const { alertType, isActive, setIsActive, message, openMessageBar } = useMessageBar();
  const currentUser = FetchCurrentUser()
  const [userFormData, setUserFormData] = useState<User>();
  useEffect(() => {
    if (currentUser) {
      setUserFormData(currentUser)
    }
  }, [currentUser])
  function handleValidation(formData: FormData) {
    let isValid = true
    return isValid
  }
  const handleSubmit = (event: any) => {
    event.preventDefault(event);
    const formData = new FormData(event.target)
    let existingFields = Array.from(formData.keys())
    for (var key in currentUser) {
      if (!existingFields.includes(key)) {
        if (key === 'friends') // @ts-ignore
          formData.append(key, currentUser[key].map((friend) => friend.id));
        else// @ts-ignore
          formData.append(key, currentUser[key]);
      }
    }
    if (!handleValidation(formData))
      return
    axios.put(`${url}api/user/${currentUser.id}/`, formData, { headers: headers })
      .then((res) => {
        openMessageBar('info', 'Profile Updated')
      })
      .catch(errors => console.warn(errors));
  };


  return (
    <div className={`${SStyles.container} ${SStyles.VertCenter} p-4`}>
      <MessageBar isActive={isActive} setIsActive={setIsActive} message={message} alertType={alertType} />
      <h1 className={SStyles.center}>My profile</h1>
      <form onSubmit={e => { handleSubmit(e) }}>
        <div className={`${SStyles.TextInput} mb-2`}>
          <input disabled name='username' type="text" value={userFormData?.username} />
          <input disabled name='email' type="text" value={userFormData?.email} />
          <input required placeholder="First Name" name='first_name' type="text" value={userFormData?.first_name} onChange={e => { setUserFormData({ ...userFormData!, [e.target.name]: e.target.value }) }} />
          <input required placeholder="Last Name" name='last_name' type="text" value={userFormData?.last_name} onChange={e => { setUserFormData({ ...userFormData!, [e.target.name]: e.target.value }) }} />
        </div>
        <div className="">
          <button type="submit" className={`${SStyles.button} ${SStyles.add} w-100`} >Update</button>
        </div>
      </form>
    </div>
  );
};

export default Profile;