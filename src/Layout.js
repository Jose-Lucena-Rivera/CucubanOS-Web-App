import React from 'react';
import 'material-design-lite/material'; 
import 'material-design-lite/material.css';
import { useLocation } from 'react-router-dom';
import './styles.css';

const Header = () => {
    const location = useLocation();
    const getPageTitle = () => {
      switch (location.pathname) {
        case '/':
          return 'Dashboard';
        case '/network':
          return 'Network';
        case '/account':
          return 'Account';
        default:
          return 'Dashboard';
      }
    };
  
    return (
      <header className="demo-header mdl-layout__header mdl-color--grey-100 mdl-color-text--grey-600">
        <div className="mdl-layout__header-row">
          <span className="mdl-layout-title">{getPageTitle()}</span>
          <div className="mdl-layout-spacer"></div>
          <div className="mdl-textfield mdl-js-textfield mdl-textfield--expandable">
            <div className="mdl-textfield__expandable-holder">
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
        <div className="drawer-header-content">
        <i className="material-icons bug-icon">bug_report</i>
        <span className="drawer-title">CucubanOS</span>
        </div>
        <div className="demo-avatar-dropdown">
          <span> Admin</span>
          <div className="mdl-layout-spacer"></div>
        </div>
      </header>
      <nav className="demo-navigation mdl-navigation mdl-color--blue-grey-800">
        <a className="mdl-navigation__link" href="/dashboard"><i className="mdl-color-text--blue-grey-400 material-icons" role="presentation">dashboard</i>Dashboard</a>
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
