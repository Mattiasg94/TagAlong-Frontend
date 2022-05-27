import React from 'react'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Container from 'react-bootstrap/Container'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as fontawesomeIcon from '../styles/fontawesome'
import { Outlet, Link, useNavigate } from "react-router-dom";
import FetchCurrentUser from '../FetchCurrentUser';
import { RootState } from '../store'
import authSlice from "../store/slices/auth";
import { useDispatch, useSelector } from "react-redux";
import Styles from '../styles/css/Header.module.scss'
import logo from '../styles/images/logo.png'

export default function Header() {
  const currentUser = FetchCurrentUser() //TODO do i need refresh user in other pages if i do it in header?
  const auth = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout = () => {
    dispatch(authSlice.actions.logout());
    navigate("/login");
  };

  return (
    <>
      <Navbar bg="light" expand="lg" className={Styles.topHeader}>
        <Container>
          <Navbar aria-controls="basic-navbar-nav" />
          <Nav className={Styles.nav} >
            {auth.account ?
              <>
                <Link className={Styles.NavBtn} to="/users"><FontAwesomeIcon icon={fontawesomeIcon.faUsers} /></Link>
                <Link className={Styles.NavBtn} to="/profile"><FontAwesomeIcon icon={fontawesomeIcon.faUser} /></Link>
                <button className={Styles.NavBtn} onClick={handleLogout}><FontAwesomeIcon icon={fontawesomeIcon.faSignOut} /></button>
              </>
              : <>
                <Link to="/landingPage"><img width={120} src={logo} alt="" /></Link>
                <Link className={Styles.NavBtn} to="/register">Sign up</Link>
                <Link className={Styles.NavBtn} to="/login">Login</Link>
              </>}
          </Nav>

        </Container>
      </Navbar>
      <Outlet />
    </>)
}
