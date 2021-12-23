import React from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice';

function Home() {
  const dispatch = useDispatch();
  const logoutHandler = () => {
    dispatch(logout());
  };
  return (
    <>
      <div>This is the home page and it is a public route.</div>
      <button onClick={logoutHandler}>Log out</button>
    </>
  );
}

export default Home;
