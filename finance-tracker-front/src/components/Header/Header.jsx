import React, { useEffect, useRef } from 'react';
import 'materialize-css/dist/css/materialize.min.css';
import M from 'materialize-css';
import './HeaderStyle.css';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/AuthSlice';
import { useNavigate } from 'react-router-dom';

function Header({ setIsSidebarOpen }) {
  const sidenavRef = useRef(null);
  const sidenavInstanceRef = useRef(null);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const instance = M.Sidenav.init(sidenavRef.current, {
      onOpenStart: () => setIsSidebarOpen(true),
      onCloseEnd: () => setIsSidebarOpen(false),
    });
    sidenavInstanceRef.current = instance;

    return () => {
      instance.destroy();
    };
  }, [setIsSidebarOpen]);

  const handleBurgerClick = () => {
    if (sidenavInstanceRef.current) {
      sidenavInstanceRef.current.isOpen
        ? sidenavInstanceRef.current.close()
        : sidenavInstanceRef.current.open();
    }
  };

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="navbar-fixed">
      <nav>
        <div className="nav-wrapper">
          <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />

          <a onClick={handleBurgerClick} className="show-burger">
            <i className="material-icons">menu</i>
          </a>

          <a href="/" className="brand-logo" style={{ marginLeft: "60px" }}>
            Finance Tracker
          </a>

          <ul id="nav-mobile" className="right hide-on-med-and-down">
            <li>{user?.name || ''}</li>
          </ul>
        </div>
      </nav>

      <ul
        id="slide-out"
        className={`sidenav ${sidenavInstanceRef.current?.isOpen ? 'open' : 'close'}`}
        ref={sidenavRef}
      >
        <li><a href="/profile">User Profile</a></li>

        {user && (
          <li className='li-sidenav-btn'>
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
