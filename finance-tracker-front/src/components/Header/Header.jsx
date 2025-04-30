import React, { useEffect, useRef } from 'react';
import 'materialize-css/dist/css/materialize.min.css';
import M from 'materialize-css';
import './HeaderStyle.css';

function Header({ setIsSidebarOpen }) {
  const sidenavRef = useRef(null);
  const sidenavInstanceRef = useRef(null);

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
      if (sidenavInstanceRef.current.isOpen) {
        sidenavInstanceRef.current.close();
      } else {
        sidenavInstanceRef.current.open();
      }
    }
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
            <li>username</li>
          </ul>
        </div>
      </nav>

      <ul
        id="slide-out"
        className={`sidenav ${sidenavInstanceRef.current && sidenavInstanceRef.current.isOpen ? 'open' : 'close'}`}
        ref={sidenavRef}
      >
        <li><a href="/">Second Link</a></li>
      </ul>
    </div>
  );
}

export default Header;
