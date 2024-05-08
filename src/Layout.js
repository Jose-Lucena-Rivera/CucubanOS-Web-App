import React, {useEffect} from 'react';
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
  
    const handleMenuItemClick = (menuItem) => {
      switch (menuItem) {
          case 'Account':
              window.location.href = '/account'; // Redirect to the account page
              break;
          case 'Sign Out':
              // Handle sign out logic
              localStorage.removeItem('token');
              window.history.pushState(null, '', '/'); // Add new history entry
              window.location.href = '/'; // Redirect to the login page
              window.location.reload();
              break;
          default:
              break;
      }
  };
  useEffect(() => {
    // Initialize MDL components
    window.componentHandler.upgradeAllRegistered();
}, []);

  let drawerButton = null;

  if (location.pathname !== '/') {
    drawerButton = (
      <button className="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--icon mdl-layout__drawer-button">
        <i className="material-icons"></i>
      </button>
    );
  }

  return (
    <header className="demo-header mdl-layout__header mdl-color--grey-100 mdl-color-text--grey-600">
      <div className="mdl-layout__header-row">
        {drawerButton}
        <span className="mdl-layout-title">{getPageTitle()}</span>
        <div className="mdl-layout-spacer"></div>
        <button className="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--icon" id="hdrbtn">
          <i className="material-icons">more_vert</i>
        </button>
        <ul className="mdl-menu mdl-js-menu mdl-js-ripple-effect mdl-menu--bottom-right" htmlFor="hdrbtn">
          <li className="mdl-menu__item" onClick={() => handleMenuItemClick('Account')}>Account</li>
          <li className="mdl-menu__item" onClick={() => handleMenuItemClick('Sign Out')}>Sign Out</li>
        </ul>
      </div>
    </header>
  );
};

const Drawer = () => {
  return (
    <div className="demo-drawer mdl-layout__drawer mdl-color--blue-grey-900 mdl-color-text--blue-grey-50">
      <header className="demo-drawer-header" style={{ backgroundColor:'#005129' }}>
      <div className="drawer-header-content" style={{ display: 'flex', alignItems: 'center' }}>
        <i className="material-icons bug-icon">bug_report</i>
          <span className="drawer-title">CucubanOS</span>
          
        </div>
        <div className="demo-avatar-dropdown">
          <span> Admin</span>
          <div className="mdl-layout-spacer"></div>
        </div>
      </header>
      <nav className="demo-navigation mdl-navigation " style={{ backgroundColor:'#005129' }}>
        <a className="mdl-navigation__link mdl-color-text--white" href="/dashboard"><i className="mdl-color-text--white material-icons" role="presentation">format_color_fill</i>Dashboard</a>
        <a className="mdl-navigation__link mdl-color-text--white" href="/network"><i className="mdl-color-text--white material-icons" role="presentation">wifi</i>Network</a>
        <a className="mdl-navigation__link mdl-color-text--white" href="/account"><i className="mdl-color-text--white material-icons" role="presentation">person</i>Account</a>
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
