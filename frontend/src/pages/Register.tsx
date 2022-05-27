import React, { useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import authSlice from "../store/slices/auth";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { csrftoken } from "../csrftoken";
import SStyles from '../styles/css/Shared.module.scss'

const headers: any = { "X-CSRFTOKEN": csrftoken }

function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleRegistration = (first_name: string, last_name: string, username: string, email: string, password: string) => {
    axios
      .post(`api/auth/register/`, { username, first_name, last_name, email, password }, { headers: headers })
      .then((res) => {
        dispatch(
          authSlice.actions.setAuthTokens({
            token: res.data.access,
            refreshToken: res.data.refresh,
          })
        );
        dispatch(authSlice.actions.setAccount(res.data.user));
        navigate("/");
      })
      .catch((error) => { console.warn(error) });
  };

  const formik = useFormik({
    initialValues: {
      first_name: 'mattias',
      last_name: 'gerle',
      username: 'mattias',
      email: "mattiasg_94@hotmail.com",
      password: "testtest",
    },
    onSubmit: (values) => {
      handleRegistration(values.first_name, values.last_name, values.username, values.email, values.password);
    },
    validationSchema: Yup.object({
      // username: Yup.string().trim().required("Req"),
      // email: Yup.string().trim().required("Req"),
      // password: Yup.string().trim().required("Req"),
    }),
  });

  return (
    <div className={`${SStyles.container} ${SStyles.VertCenter} p-4`}>
      <h1 className={SStyles.center}>Sign up</h1>
      <form onSubmit={formik.handleSubmit}>
        <div className={SStyles.TextInput}>
          <input
            id="username"
            type="text"
            placeholder="Username"
            name="username"
            value={formik.values.username}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            required
          />
          {formik.errors.username ? <div>{formik.errors.username} </div> : null}
          <input
            id="first_name"
            type="text"
            placeholder="First Name"
            name="first_name"
            value={formik.values.first_name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            required
          />
          {formik.errors.first_name ? <div>{formik.errors.first_name} </div> : null}
          <input
            id="last_name"
            type="text"
            placeholder="Last Name"
            name="last_name"
            value={formik.values.last_name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            required
          />
          {formik.errors.last_name ? <div>{formik.errors.last_name} </div> : null}
          <input
            id="email"
            type="email"
            placeholder="Email"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            required
          />
          {formik.errors.email ? <div>{formik.errors.email} </div> : null}
          <input
            id="password"
            type="password"
            placeholder="Password"
            name="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            required
          />
          {formik.errors.password ? (
            <div>{formik.errors.password} </div>
          ) : null}
        </div>
        <div className="">
          <button type="submit" className={`${SStyles.button} ${SStyles.add} w-100 mt-2`} >Sign up</button>
        </div>
      </form>
    </div>
  );
}

export default Register;