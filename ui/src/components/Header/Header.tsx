import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import useBalance from './hooks/useBalance';
import Cookies from 'js-cookie';

function Header() {
  const { data: balance, isLoading, error } = useBalance();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const navigate = useNavigate();

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    handleClose();
  };

  const handleLogout = () => {
    Cookies.remove('token');
    Cookies.remove('isAuthenticated');
  }

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
              Home
            </Link>
          </li>
        </ul>
      </nav>
      <div className="flex items-center">
        {isLoading ? (
          <span>Loading...</span>
        ) : error ? (
          <span>
            An error occurred:{' '}
            {(error as AxiosError).message || 'Unknown error'}
          </span>
        ) : (
          <span>Balance: {balance?.amount} UAH</span>
        )}
      </div>
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
            Profile
          </MenuItem>
          <MenuItem onClick={() => handleNavigate('/payment')}>Top up</MenuItem>
          <MenuItem onClick={() => handleLogout()}>Logout</MenuItem>
        </Menu>
      </div>
    </header>
  );
}

export default Header;
