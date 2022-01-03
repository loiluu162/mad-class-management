import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { ROLE_ADMIN } from '../constants/roles';
import {
  selectCurrentUser,
  selectLoggedInStatus,
} from '../features/auth/authSlice';
import { userHasAnyRoles } from '../utils';

function Navbar() {
  const loggedIn = useSelector(selectLoggedInStatus);
  const { roles = [] } = useSelector(selectCurrentUser);
  const isAdmin = userHasAnyRoles(roles, [ROLE_ADMIN]);
  return (
    <nav className='navbar navbar-expand-lg navbar-light sticky-top'>
      <div className='container'>
        <Link className='navbar-brand' to={'/'}>
          Madison
        </Link>
        <div className='collapse navbar-collapse' id='navbarTogglerDemo02'>
          <ul className='navbar-nav ml-auto'>
            {!loggedIn ? (
              <>
                <li className='nav-item'>
                  <Link className='nav-link' to={'/login'}>
                    Login
                  </Link>
                </li>
                <li className='nav-item'>
                  <Link className='nav-link' to={'/signup'}>
                    Sign up
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li className='nav-item'>
                  <Link className='nav-link' to={'/profile'}>
                    Profile
                  </Link>
                </li>
                <li className='nav-item'>
                  <Link
                    className='nav-link'
                    to={isAdmin ? '/admin/classes' : '/classes'}
                  >
                    Class
                  </Link>
                </li>
                <li className='nav-item'>
                  <Link
                    className='nav-link'
                    to={isAdmin ? '/admin/registration' : '/registration'}
                  >
                    Registration
                  </Link>
                </li>
                <li className='nav-item'>
                  <Link className='nav-link' to={'/classes'}>
                    UClass
                  </Link>
                </li>
                <li className='nav-item'>
                  <Link className='nav-link' to={'/registration'}>
                    URegistration
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
