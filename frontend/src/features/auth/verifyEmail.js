import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { verifyEmail } from './authSlice';

import { clearMessage, selectMessage } from '../message/messageSlice';
import ErrorMessage from '../message/errorMessage';
import Loading from '../../components/loading';

const VerifyEmail = (props) => {
  const [code, setCode] = useState('');

  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const handleChangeCode = (e) => {
    setCode(e.target.value);
  };
  const handleVerification = (e) => {
    e.preventDefault();
    setLoading(true);
    dispatch(verifyEmail({ code }))
      .unwrap()
      .then((_) => {
        setLoading(false);
      })
      .catch((_) => setLoading(false));
  };

  useEffect(() => {
    dispatch(clearMessage());
  }, []);

  const message = useSelector(selectMessage);

  return (
    <div>
      <p>
        You have been successfully signed up on Madison. Please check your email
        to enter verification code
      </p>
      <form onSubmit={handleVerification}>
        <div className='form-group'>
          <label>Code</label>
          <input
            type='text'
            className='form-control'
            placeholder='verification code'
            onChange={handleChangeCode}
            value={code}
          />
        </div>
        <Loading loading={loading} />
        {!loading && <ErrorMessage message={message} />}
        <button type='submit' className='btn btn-primary btn-block'>
          Verify
        </button>
      </form>
    </div>
  );
};

export default VerifyEmail;
