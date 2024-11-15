import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faBars } from '@fortawesome/free-solid-svg-icons';
import { Avatar } from '@mui/material';
import '../assets/styles/Header.css';
import { useLocation } from 'react-router-dom';
import { userService } from '../services/api';

const getStoredProjects = () => {
  return JSON.parse(localStorage.getItem('projects')) || [];
};

const pageNameMapping = {
  '/': 'Meus Projetos',
  '/calendar': 'Calendário',
  '/history': 'Histórico',
  '/settings': 'Configurações da Conta',
};

const Header = ({ toggleNavbar, isNavbarVisible }) => {
  const location = useLocation();
  const [projectNames, setProjectNames] = useState([]);
  const [userName, setUserName] = useState('');
  const [userImage, setUserImage] = useState('');
  const [userRole, setUserRole] = useState('Usuário');

  useEffect(() => {
    const storedProjects = getStoredProjects();
    const names = storedProjects.map((project) => project.projectName);
    setProjectNames(names);
  }, []);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = await userService.getCurrentUser();
        setUserName(userData.nome);
        setUserImage(userData.imagem);

        setUserRole(userData.cargo || 'Usuário');
      } catch (error) {
        console.error('Erro ao carregar dados do usuário', error);
      }
    };

    loadUserData();
  }, []);

  let currentPageName = pageNameMapping[location.pathname];

  if (!currentPageName && location.pathname !== '/') {
    const projectName = decodeURIComponent(location.pathname.substring(1));
    if (projectNames.includes(projectName)) {
      currentPageName = `${projectName}`;
    } else {
      currentPageName = 'Projeto Inválido';
    }
  }

  return (
    <header className={`header ${isNavbarVisible ? '' : 'full-width'}`}>
      <span className='menu-button'>
        <FontAwesomeIcon icon={faBars} onClick={toggleNavbar} />
      </span>

      <ul className='current-page'>
        <li>{currentPageName}</li>
      </ul>

      <div className='user-details'>
        <span className='icon-wrapper-header'>
          <FontAwesomeIcon icon={faBell} />
        </span>

        {userImage ? (
          <Avatar className='avatar' sx={{ width: 50, height: 50 }} src={userImage} />
        ) : (
          <Avatar className='avatar' sx={{ width: 50, height: 50 }}>
            {userName && userName.trim() !== ''
              ? userName
                  .split(' ')
                  .filter((name) => name.length > 2) // Filtra palavras com mais de 2 caracteres
                  .map((name, index, array) =>
                    index === 0 || index === array.length - 1 ? name[0].toUpperCase() : ''
                  )
                  .join('')
                  .slice(0, 2)
              : ''}
          </Avatar>
        )}

        <ul className='user-info-list'>
          <li className='info-list-name'>{userName}</li>
          <li className='info-list-position'>{userRole}</li>
        </ul>
      </div>
    </header>
  );
};

export default Header;
