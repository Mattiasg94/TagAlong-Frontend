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

export default function HeaderBottom() {
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
      <Navbar bg="light" expand="lg" className={Styles.bottomHeader}>
        <Container>
          <Navbar aria-controls="basic-navbar-nav" />
          <Nav className={Styles.nav}>
            <Link className="mybtn mybtn-def" to="/"><FontAwesomeIcon icon={fontawesomeIcon.faCalendarAlt} /></Link>
            <Link className="mybtn mybtn-def" to="/explore"><FontAwesomeIcon icon={fontawesomeIcon.faSearch} /></Link>
            <Link className="mybtn mybtn-def" to="/new-event"><FontAwesomeIcon icon={fontawesomeIcon.faPlus} /></Link>
          </Nav>
        </Container>
      </Navbar>
      <Outlet />
    </>)
}
