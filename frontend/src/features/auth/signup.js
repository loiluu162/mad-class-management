import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signup } from './authSlice';

import { Redirect, Link } from 'react-router-dom';
import { clearMessage, selectMessage } from '../message/messageSlice';
import ErrorMessage from '../message/errorMessage';
import Loading from '../../components/loading';
import { toast } from 'react-hot-toast';
export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(clearMessage());
  }, []);

  const message = useSelector(selectMessage);

  const handleChangeEmail = (e) => setEmail(e.target.value);
  const handleChangePassword = (e) => setPassword(e.target.value);
  const handleChangeConfirmPassword = (e) => setConfirmPassword(e.target.value);
  const handleChangeName = (e) => setName(e.target.value);

  const signupHandler = (e) => {
    e.preventDefault();
    setLoading(true);
    dispatch(signup({ email, name, password, confirmPassword }))
      .unwrap()
      .then((_) => {
        setSuccess(true);
        setLoading(false);
        toast.success('Successfully signed up');
      })
      .catch((_) => setLoading(false));
  };

  if (success) return <Redirect to='verifyEmail' />;

  return (
    <form onSubmit={signupHandler}>
      <h3>Sign Up</h3>

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
        Sign up
      </button>
      <p className='forgot-password text-right'>
        Already registered <Link to='/login'>sign in?</Link>
      </p>
    </form>
  );
}
