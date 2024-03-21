import React from 'react';
import 'material-design-lite/material'; 
import 'material-design-lite/material.css';


const Header = () => {
  return (
    <header className="demo-header mdl-layout__header mdl-color--grey-100 mdl-color-text--grey-600">
      <div className="mdl-layout__header-row">
        <span className="mdl-layout-title">Dashboard</span>
        <div className="mdl-layout-spacer"></div>
        <div className="mdl-textfield mdl-js-textfield mdl-textfield--expandable">
          <label className="mdl-button mdl-js-button mdl-button--icon" htmlFor="search">
            <i className="material-icons">search</i>
          </label>
          <div className="mdl-textfield__expandable-holder">
            <input className="mdl-textfield__input" type="text" id="search" />
            <label className="mdl-textfield__label" htmlFor="search">Enter your query...</label>
          </div>
        </div>
        <button className="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--icon" id="hdrbtn">
          <i className="material-icons">more_vert</i>
        </button>
        <ul className="mdl-menu mdl-js-menu mdl-js-ripple-effect mdl-menu--bottom-right" htmlFor="hdrbtn">
          <li className="mdl-menu__item">Account</li>
          <li className="mdl-menu__item">Sign Out</li>
        </ul>
      </div>
    </header>
  );
};

const Drawer = () => {
  return (
    <div className="demo-drawer mdl-layout__drawer mdl-color--blue-grey-900 mdl-color-text--blue-grey-50">
      <header className="demo-drawer-header">
        <img src="images/user.jpg" className="demo-avatar" alt="User" />
        <div className="demo-avatar-dropdown">
          <span>hello@example.com</span>
          <div className="mdl-layout-spacer"></div>
          <button id="accbtn" className="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--icon">
            <i className="material-icons" role="presentation">arrow_drop_down</i>
            <span className="visuallyhidden">Accounts</span>
          </button>
          <ul className="mdl-menu mdl-menu--bottom-right mdl-js-menu mdl-js-ripple-effect" htmlFor="accbtn">
            <li className="mdl-menu__item">hello@example.com</li>
            <li className="mdl-menu__item">info@example.com</li>
            <li className="mdl-menu__item"><i className="material-icons">add</i>Add another account...</li>
          </ul>
        </div>
      </header>
      <nav className="demo-navigation mdl-navigation mdl-color--blue-grey-800">
        <a className="mdl-navigation__link" href="/"><i className="mdl-color-text--blue-grey-400 material-icons" role="presentation">dashboard</i>Dashboard</a>
        <a className="mdl-navigation__link" href="/network"><i className="mdl-color-text--blue-grey-400 material-icons" role="presentation">wifi</i>Network</a>
        <a className="mdl-navigation__link" href="/account"><i className="mdl-color-text--blue-grey-400 material-icons" role="presentation">person</i>Account</a>
      </nav>
    </div>
  );
};

const Layout = ({ children }) => {
  return (
    <div className="demo-layout mdl-layout mdl-js-layout mdl-layout--fixed-drawer mdl-layout--fixed-header">
      <Header />
      <Drawer />
      <main className="mdl-layout__content mdl-color--grey-100">
        {children}
      </main>
    </div>
  );
};

export default Layout;
