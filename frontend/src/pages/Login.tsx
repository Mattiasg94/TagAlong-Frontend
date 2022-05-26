import React, { useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import authSlice from "../store/slices/auth";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { csrftoken } from "../csrftoken";
import Styles from '../styles/css/Login.module.scss'
import SStyles from '../styles/css/Shared.module.scss'


const headers: any = { "X-CSRFTOKEN": csrftoken }

function Login() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = (email: string, password: string) => {
    // let username = 'mattias'
    let username = email
    axios
      .post(`api/auth/login/`, { username, password }, { headers: headers })
      .then((res) => {
        dispatch(
          authSlice.actions.setAuthTokens({
            token: res.data.access,
            refreshToken: res.data.refresh,
          })
        );
        dispatch(authSlice.actions.setAccount(res.data.user));
        setLoading(false);
        navigate("/");
      })
      .catch((error) => {
        // setMessage(err.response.data.detail.toString());
        console.warn(error)
      });
  };

  const formik = useFormik({
    initialValues: {
      email: "mattias",
      password: "testtest",
    },
    onSubmit: (values) => {
      setLoading(true);
      handleLogin(values.email, values.password);
    },
    validationSchema: Yup.object({
      email: Yup.string().trim().required("Le nom d'utilisateur est requis"),
      password: Yup.string().trim().required("Le mot de passe est requis"),
    }),
  });

  return (
    <div className={`${SStyles.container} ${SStyles.VertCenter} p-4`}>
      <div>
        <h1 className={SStyles.center}>Sign in</h1>
        <form onSubmit={formik.handleSubmit}>
          <div className={SStyles.TextInput}>
            <input
              id="email"
              type="text"
              placeholder="Email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
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
            />
            {formik.errors.password ? (
              <div>{formik.errors.password} </div>
            ) : null}
          </div>
          <div className="text-danger text-center my-2" hidden={false}>
            {message}
          </div>

          <div>
            <button type="submit" className={`${SStyles.button} ${SStyles.add} w-100`}>Login</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;