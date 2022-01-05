import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ErrorMessage from '../message/errorMessage';
import Loading from '../../components/loading';
import { clearMessage, selectMessage } from '../message/messageSlice';
import { changePassword } from './authSlice';
import { confirm } from '../../utils';
import { useHistory } from 'react-router-dom';

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const history = useHistory();

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(clearMessage());
  }, [dispatch]);

  const message = useSelector(selectMessage);

  const handleChangePassword = (e) => {
    e.preventDefault();
    confirm(() => {
      setLoading(true);
      dispatch(
        changePassword({ currentPassword, newPassword, confirmNewPassword })
      )
        .unwrap()
        .then((_) => {
          setSuccess(true);
          setLoading(false);
          history.push('/profile');
        })
        .catch((_) => setLoading(false));
    });
  };
  const handleChangeCurrentPassword = (e) => setCurrentPassword(e.target.value);
  const handleChangeNewPassword = (e) => setNewPassword(e.target.value);
  const handleChangeConfirmNewPassword = (e) =>
    setConfirmNewPassword(e.target.value);

  return (
    <div>
      <label>Change your password</label>
      <form onSubmit={handleChangePassword}>
        <div className='form-group'>
          <label>Current password</label>
          <input
            type='password'
            className='form-control'
            placeholder='Current password'
            required
            onChange={handleChangeCurrentPassword}
            value={currentPassword}
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
          Change Password
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
