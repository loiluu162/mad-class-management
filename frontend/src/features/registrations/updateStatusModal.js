import Modal from 'react-modal';
import React, { useState } from 'react';
import RegStatusPicker from '../../components/regStatusPicker';
import { toast } from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { changeRegStatus } from './registrationSlice';
import { Spinner } from '../../components/spinner';

const UpdateStatusModal = ({
  isOpen,
  closeModal,
  label = 'TEST',
  registration,
}) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const handleChangeStatus = (e) => {
    console.log(status.value, registration.userId, registration.classId);
    setLoading(true);
    dispatch(
      changeRegStatus({
        status: status.value,
        userId: registration.userId,
        classId: registration.classId,
      })
    )
      .unwrap()
      .then(() => {
        toast.success('Success');
        setLoading(false);
        closeModal();
      })
      .catch((err) => {
        console.log(err);
        toast.error('error');
        setLoading(false);
      });
  };
  const [status, setStatus] = useState(null);

  return (
    <>
      {loading && <Spinner />}
      {!loading && registration && (
        <Modal
          className='reg-update-modal'
          overlayClassName='overlay'
          isOpen={isOpen}
          onRequestClose={closeModal}
          contentLabel={label}
          ariaHideApp={false}
        >
          <article>
            <h5>
              From <b>{registration.userFullName}</b> @
              <i>{registration.email}</i>
            </h5>

            <h6>
              Register to class <b>{registration.className}</b>
            </h6>
          </article>
          <RegStatusPicker onChange={setStatus} value={status} />
          <div>
            <button type='button' onClick={handleChangeStatus}>
              Change
            </button>
            <button type='button' onClick={closeModal}>
              Close
            </button>
          </div>
        </Modal>
      )}
    </>
  );
};

export default UpdateStatusModal;
