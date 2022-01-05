import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import Loading from '../../components/loading';
import { signup } from '../auth/authSlice';
import ErrorMessage from '../message/errorMessage';
import { clearMessage, selectMessage } from '../message/messageSlice';
import { newUser } from './userSlice';

const AddNewUser = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(clearMessage());
  }, [dispatch]);

  const message = useSelector(selectMessage);

  const handleChangeEmail = (e) => setEmail(e.target.value);
  const handleChangePassword = (e) => setPassword(e.target.value);
  const handleChangeConfirmPassword = (e) => setConfirmPassword(e.target.value);
  const handleChangeName = (e) => setName(e.target.value);

  const signupHandler = (e) => {
    e.preventDefault();
    setLoading(true);
    dispatch(newUser({ email, name, password, confirmPassword }))
      .unwrap()
      .then((_) => {
        setSuccess(true);
        setLoading(false);
        toast.success('Successfully signed up');
      })
      .catch((_) => setLoading(false));
  };

  if (success) return <Redirect to='/admin/users' />;
  return (
    <form onSubmit={signupHandler}>
      <h3>Add new user</h3>

      <div className='form-group'>
        <label>Full Name</label>
        <input
          type='text'
          className='form-control'
          placeholder='Full name'
          onChange={handleChangeName}
          required
        />
      </div>

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

      <div className='form-group'>
        <label>Confirm password</label>
        <input
          type='password'
          className='form-control'
          placeholder='Confirm password'
          onChange={handleChangeConfirmPassword}
          required
        />
      </div>
      <Loading loading={loading} />
      <ErrorMessage message={message} />
      <button type='submit' className='btn btn-primary btn-block'>
        Create
      </button>
    </form>
  );
};

export default AddNewUser;
