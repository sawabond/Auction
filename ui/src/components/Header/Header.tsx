import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import LanguageIcon from '@mui/icons-material/Language';
import Cookies from 'js-cookie';
import { useTranslation } from 'react-i18next';
import useBalance from './hooks/useBalance';
import useUserFromToken from '../../hooks/useUserFromToken';
import { Roles } from '../enums/roles';
import SellerPages from './components/SellerPages';
import UserPages from './components/UserPages';

function Header() {
  const { t, i18n } = useTranslation();
  const { data: balance, isLoading, error } = useBalance();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [langAnchorEl, setLangAnchorEl] = React.useState<null | HTMLElement>(
    null
  );
  const [roleName, setRoleName] = useState(null);
  const user = useUserFromToken();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRole = async () => {
      try {
        //const role = await getUserRole(user?.id);
        setRoleName(user.roles);
      } catch (error) {
        console.error('Failed to fetch user role', error);
      }
    };

    if (user) {
      fetchRole();
    }
  }, [user, roleName]);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLangMenu = (event: React.MouseEvent<HTMLElement>) => {
    setLangAnchorEl(event.currentTarget);
  };

  const handleLangClose = () => {
    setLangAnchorEl(null);
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    handleClose();
  };

  const handleLogout = () => {
    Cookies.remove('token');
    Cookies.remove('isAuthenticated');
  };

  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language);
    handleLangClose();
  };

  return (
    <header className="bg-blue-500 text-white p-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold">
        AuctionOnline
      </Link>
      <nav className="flex-grow mx-4">
        <ul className="flex justify-center space-x-4">
          <li>
            <Link
              to="/"
              className="text-white hover:text-blue-200 transition duration-150 ease-in-out"
            >
              {t('home')}
            </Link>
          </li>
          {roleName == Roles.Seller ?
           <SellerPages></SellerPages> 
           : roleName == Roles.User ? 
           <UserPages></UserPages>
           : <></>
          }
        </ul>
      </nav>
      <div className="flex items-center">
        <IconButton
          size="large"
          aria-label="language selection"
          aria-controls="menu-lang"
          aria-haspopup="true"
          onClick={handleLangMenu}
          color="inherit"
        >
          <LanguageIcon />
        </IconButton>
        <Menu
          id="menu-lang"
          anchorEl={langAnchorEl}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          keepMounted
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          open={Boolean(langAnchorEl)}
          onClose={handleLangClose}
        >
          <MenuItem onClick={() => changeLanguage('en')}>English</MenuItem>
          <MenuItem onClick={() => changeLanguage('ua')}>Українська</MenuItem>
        </Menu>
        {Cookies.get('isAuthenticated') === 'true' ? (
          <>
            {isLoading ? (
              <span>{t('loading')}</span>
            ) : error ? (
              <span>
                {t('error')}: {(error as AxiosError).message || 'Unknown error'}
              </span>
            ) : (
              <span>
                {t('balance')}: {balance?.amount} {t('currency')}
              </span>
            )}
            <div>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <PersonRoundedIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                keepMounted
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={() => handleNavigate('/profile')}>
                  {t('profile')}
                </MenuItem>
                <MenuItem onClick={() => handleNavigate('/payment')}>
                  {t('topUp')}
                </MenuItem>
                <MenuItem onClick={handleLogout}>{t('logout')}</MenuItem>
              </Menu>
            </div>
          </>
        ) : (
          <Link
            to="/welcome"
            className="text-white hover:text-blue-200 transition duration-150 ease-in-out"
          >
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              color="inherit"
            >
              <PersonRoundedIcon />
            </IconButton>
            {t('login')}
          </Link>
        )}
      </div>
    </header>
  );
}

export default Header;
