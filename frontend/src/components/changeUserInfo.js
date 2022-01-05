import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { changeUserInfo, selectCurrentUser } from '../features/auth/authSlice';
import { confirm } from '../utils';

const ChangeUserInfo = () => {
  const user = useSelector(selectCurrentUser);

  const [userInfo, setUserInfo] = useState({ name: user.name });

  const handleChange = (e) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  };
  const history = useHistory();
  const dispatch = useDispatch();
  const handleSubmit = (e) => {
    e.preventDefault();
    confirm({
      handleYes: () => {
        dispatch(changeUserInfo(userInfo))
          .unwrap()
          .then(() => history.push('/profile'));
      },
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className='form-group'>
        <label>Your name</label>
        <input
          className='form-control'
          type='text'
          required
          placeholder='Your new name'
          value={userInfo.name}
          name='name'
          onChange={handleChange}
        />
      </div>
      <div className='form-group'>
        <button type='submit' className='btn btn-primary btn-block'>
          submit
        </button>
      </div>
    </form>
  );
};

export default ChangeUserInfo;
