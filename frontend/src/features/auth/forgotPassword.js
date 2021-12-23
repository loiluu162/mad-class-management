import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ErrorMessage from '../message/errorMessage';
import Loading from '../../components/loading';
import { clearMessage, selectMessage } from '../message/messageSlice';
import { requestForgotPassword } from './authSlice';
import { Redirect } from 'react-router-dom';
const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const message = useSelector(selectMessage);
  const handleChangeEmail = (e) => setEmail(e.target.value);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(clearMessage());
  }, [dispatch]);

  const [success, setSuccess] = useState(false);

  const handleRequestForgotPassword = (e) => {
    e.preventDefault();
    setLoading(true);
    dispatch(requestForgotPassword({ email }))
      .unwrap()
      .then((_) => {
        setLoading(false);
        setSuccess(true);
      });
  };

  if (success) return <Redirect to='/resetPassword' />;

  return (
    <div>
      <label>Request forgot password email</label>
      <form onSubmit={handleRequestForgotPassword}>
        <div className='form-group'>
          <label>Code</label>
          <input
            type='email'
            className='form-control'
            placeholder='Your email'
            required
            onChange={handleChangeEmail}
            value={email}
          />
        </div>
        <Loading loading={loading} />
        {!loading && <ErrorMessage message={message} />}
        <button type='submit' className='btn btn-primary btn-block'>
          Request
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
