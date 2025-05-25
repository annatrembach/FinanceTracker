import React, { useEffect, useRef } from 'react';
import 'materialize-css/dist/css/materialize.min.css';
import M from 'materialize-css';
import './HeaderStyle.css';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/AuthSlice';
import { useNavigate, useLocation } from 'react-router-dom';

function Header({ setIsSidebarOpen }) {
  const sidenavRef = useRef(null);
  const sidenavInstanceRef = useRef(null);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const instance = M.Sidenav.init(sidenavRef.current, {
      onOpenStart: () => setIsSidebarOpen(true),
      onCloseEnd: () => setIsSidebarOpen(false),
    });
    sidenavInstanceRef.current = instance;

    setTimeout(() => {
      instance.close();
      setIsSidebarOpen(false);
    }, 100); 

    return () => {
      instance.destroy();
    };
  }, [setIsSidebarOpen, location.pathname]); 

  const handleBurgerClick = () => {
    if (sidenavInstanceRef.current) {
      sidenavInstanceRef.current.isOpen
        ? sidenavInstanceRef.current.close()
        : sidenavInstanceRef.current.open();
    }
  };

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/');
  };

  const pinkPages = ['/dashboard', '/goals'];
  const turquoisePages = ['/profile', '/transactions'];

  let navColorClass = '';
  if (pinkPages.includes(location.pathname)) {
    navColorClass = 'nav-pink';
  } else if (turquoisePages.includes(location.pathname)) {
    navColorClass = 'nav-turquoise';
  }

  return (
    <div className={`navbar-fixed ${navColorClass}`}>
      <nav>
        <div className="nav-wrapper">
          <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
          <a onClick={handleBurgerClick} className="show-burger" style={{ cursor: 'pointer' }}>
            <i className="material-icons">menu</i>
          </a>
          <a href="/dashboard" className="brand-logo" style={{ marginLeft: "60px" }}>
            Finance Tracker
          </a>
          <ul id="nav-mobile" className="right hide-on-med-and-down">
            <li>{user?.name || ''}</li>
          </ul>
        </div>
      </nav>

      <ul id="slide-out" className="sidenav" ref={sidenavRef}>
        <li><a href="/profile">Profile</a></li>
        <li><a href="/dashboard">Dashboard</a></li>
        <li><a href="/goals">My Goals</a></li>
        <li><a href="/transactions">My Transactions</a></li>
        {user && (
          <li className="li-sidenav-btn">
            <button onClick={handleLogout} className="sidenav-btn">
              Logout
            </button>
          </li>
        )}
      </ul>
    </div>
  );
}

export default Header;
