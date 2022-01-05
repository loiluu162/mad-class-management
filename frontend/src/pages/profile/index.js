import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { selectCurrentUser } from '../../features/auth/authSlice';

function Profile() {
  const user = useSelector(selectCurrentUser);

  return (
    <>
      <div className='nav-buttons-group'>
        <Link to='/changePassword' className='button'>
          change password
        </Link>
        <Link to='/changeAvatar' className='button'>
          change avatar
        </Link>
        <Link to='/changeInfo' className='button'>
          change info
        </Link>
      </div>
      <div className='profile-card'>
        <img src={user.photoUrl} alt={user.name} />
        <div className='profile-card__info'>
          <h1>{user.name}</h1>
          <span>{user.email}</span>
          <p>
            {user.roles.map((role) => (
              <p>{role}</p>
            ))}
          </p>
        </div>
      </div>
    </>
  );
}

export default Profile;
