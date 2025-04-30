import React, { useEffect } from 'react';
import 'materialize-css/dist/css/materialize.min.css';
import M from 'materialize-css';
import './HeaderStyle.css';

function Header({ setIsSidebarOpen }) {
  useEffect(() => {
    const elems = document.querySelectorAll('.sidenav');
    const instances = M.Sidenav.init(elems, {
      onOpenStart: () => setIsSidebarOpen(true),
      onCloseEnd: () => setIsSidebarOpen(false),
    });

    return () => {
      instances.forEach(instance => instance.destroy());
    };
  }, [setIsSidebarOpen]);

  return (
    <div className="navbar-fixed">
      <nav>
        <div className="nav-wrapper">
          {/* Підключення іконок Material Icons */}
          <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
          
          {/* Бургер-меню */}
          <a href="#" data-target="slide-out" className="sidenav-trigger show-burger">
            <i className="material-icons">menu</i>
          </a>

          {/* Логотип */}
          <a href="/" className="brand-logo" style={{ marginLeft: "60px" }}>
            Finance Tracker
          </a>

          {/* Правий кут (username) */}
          <ul id="nav-mobile" className="right hide-on-med-and-down">
            <li>username</li>
          </ul>
        </div>
      </nav>

      {/* Сайдбар */}
      <ul id="slide-out" className="sidenav">
        <li><a href="/">Second Link</a></li>
      </ul>
    </div>
  );
}

export default Header;
