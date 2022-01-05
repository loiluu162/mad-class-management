import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectLoggedInStatus, login } from './authSlice';
import { Link, Redirect } from 'react-router-dom';
import { useState } from 'react';
import { clearMessage, selectMessage } from '../message/messageSlice';
import ErrorMessage from '../message/errorMessage';
import Loading from '../../components/loading';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(clearMessage());
  }, []);

  const message = useSelector(selectMessage);

  const handleChangeEmail = (e) => setEmail(e.target.value);
  const handleChangePassword = (e) => setPassword(e.target.value);

  const loginHandler = (e) => {
    e.preventDefault();
    setLoading(true);
    dispatch(login({ email, password }))
      .unwrap()
      .then((_) => {
        setLoading(false);
      })
      .catch((_) => setLoading(false));
  };

  return (
    <form onSubmit={loginHandler}>
      <h3>Sign In</h3>

      <div className='form-group'>
        <label>Email address</label>
        <input
          type='email'
          className='form-control'
          placeholder='Enter email'
          onChange={handleChangeEmail}
          required
        />
      </div>

      <div className='form-group'>
        <label>Password</label>
        <input
          type='password'
          className='form-control'
          placeholder='Enter password'
          onChange={handleChangePassword}
          required
        />
      </div>

      <button type='submit' className='btn btn-primary btn-block'>
        Login
      </button>
      <Loading loading={loading} />
      {!loading && <ErrorMessage message={message} />}
      <p className='forgot-password text-right'>
        <Link to={'/forgotPassword'}>Forgot password?</Link>
      </p>
    </form>
  );
}

export default Login;
