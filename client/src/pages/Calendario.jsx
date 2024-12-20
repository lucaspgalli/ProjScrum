import React from 'react';
import Navbar from '../components/NavBar';
import Header from '../components/Header';
import CalendarioMainContent from '../components/CalendarioMainContent';

function Calendario({ theme, setTheme, isNavbarVisible, toggleNavbar, setIsAuthenticated, userRole }) {
  return (
    <div className={`container ${theme}`}>
      <Header toggleNavbar={toggleNavbar} isNavbarVisible={isNavbarVisible} />
      <Navbar
        theme={theme}
        setTheme={setTheme}
        isVisible={isNavbarVisible}
        setIsAuthenticated={setIsAuthenticated}
        userRole={userRole}
      />
      <CalendarioMainContent isNavbarVisible={isNavbarVisible} />
    </div>
  );
}

export default Calendario;
