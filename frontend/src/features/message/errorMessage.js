import React from 'react';

const ErrorMessage = ({ message }) => {
  return (
    <>
      {message && (
        <div className='form-group'>
          {message.split('\n').map((m) => (
            <div className='alert alert-danger' role='alert' key={m}>
              {m}
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default ErrorMessage;
