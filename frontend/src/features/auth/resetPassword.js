import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ErrorMessage from '../message/errorMessage';
import Loading from '../../components/loading';
import { clearMessage, selectMessage } from '../message/messageSlice';
import { resetPassword } from './authSlice';

const ResetPassword = () => {
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(clearMessage());
  }, []);

  const message = useSelector(selectMessage);

  const handleResetPassword = (e) => {
    e.preventDefault();
    setLoading(true);
    dispatch(resetPassword({ code, newPassword, confirmNewPassword }))
      .unwrap()
      .then((_) => {
        setSuccess(true);
        setLoading(false);
      })
      .catch((_) => setLoading(false));
  };
  const handleChangeResetPasswordCode = (e) => setCode(e.target.value);
  const handleChangeNewPassword = (e) => setNewPassword(e.target.value);
  const handleChangeConfirmNewPassword = (e) =>
    setConfirmNewPassword(e.target.value);

  return (
    <div>
      <label>Reset your password</label>
      <form onSubmit={handleResetPassword}>
        <div className='form-group'>
          <label>Code</label>
          <input
            type='text'
            className='form-control'
            placeholder='Reset password code'
            required
            onChange={handleChangeResetPasswordCode}
            value={code}
          />
        </div>
        <div className='form-group'>
          <label>New password</label>
          <input
            type='password'
            className='form-control'
            placeholder='New password'
            required
            onChange={handleChangeNewPassword}
            value={newPassword}
          />
        </div>
        <div className='form-group'>
          <label>Confirm password</label>
          <input
            type='password'
            className='form-control'
            placeholder='Confirm password'
            required
            onChange={handleChangeConfirmNewPassword}
            value={confirmNewPassword}
          />
        </div>
        <Loading loading={loading} />
        {!loading && <ErrorMessage message={message} />}
        <button type='submit' className='btn btn-primary btn-block'>
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
