import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { changeAvatar } from '../features/auth/authSlice';
import { Spinner } from './spinner';

const ChangeAvt = () => {
  const [state, setState] = useState({ imagePreview: null, imageFile: null });
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const dispatch = useDispatch();
  const handleImagePreview = (e) => {
    const image_as_base64 = URL.createObjectURL(e.target.files[0]);
    const image_as_files = e.target.files[0];
    setState({
      imagePreview: image_as_base64,
      imageFile: image_as_files,
    });
  };

  // Image/File Submit Handler
  const handleSubmitFile = (e) => {
    e.preventDefault();
    if (state.imageFile !== null) {
      let formData = new FormData();
      formData.append('avatar', state.imageFile);
      setLoading(true);
      dispatch(changeAvatar({ formData }))
        .unwrap()
        .then(() => history.push('/profile'))
        .catch(() => {
          toast.error('Error');
          setLoading(false);
        });
    }
  };
  return (
    <form onSubmit={handleSubmitFile}>
      {loading && <Spinner />}
      <div className='form-group'>
        {state.imagePreview && <img src={state.imagePreview} alt='preview' />}
        <input type='file' onChange={handleImagePreview} />
      </div>
      <div className='form-group'>
        <button className='btn btn-primary btn-block' type='submit'>
          Submit
        </button>
      </div>
    </form>
  );
};

export default ChangeAvt;
