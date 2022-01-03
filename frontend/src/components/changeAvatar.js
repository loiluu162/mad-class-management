import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { changeAvatar } from '../features/auth/authSlice';

const ChangeAvt = () => {
  const [state, setState] = useState({ imagePreview: null, imageFile: null });
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
      dispatch(changeAvatar({ formData }));
    }
  };
  return (
    <form onSubmit={handleSubmitFile}>
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
