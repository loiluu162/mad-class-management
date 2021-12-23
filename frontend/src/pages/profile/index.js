import React from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../features/auth/authSlice';

function Profile() {
  const user = useSelector(selectCurrentUser);
  return (
    <div>
      <p>{user.id}</p>
      <p>{user.name}</p>
      <p>{user.email}</p>
    </div>
  );
}

export default Profile;
