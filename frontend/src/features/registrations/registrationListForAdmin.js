import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Spinner } from '../../components/spinner';
import StatusFilter from '../../components/statusFilter';
import { getFiltered } from '../classes/userClassList';
import {
  fetchRegistrations,
  selectAllRegistrations,
} from './registrationSlice';
import UpdateStatusModal from './updateStatusModal';

export const getColorForStatus = (status) => {
  return status === 'REJECT'
    ? 'gray'
    : status === 'PENDING'
    ? 'orange'
    : status === 'CANCELED'
    ? 'red'
    : 'green';
};

const RegistrationExpert = ({ reg, handleUpdateClick }) => {
  return (
    <article className='post-excerpt'>
      <h5>
        From <b>{reg.userFullName}</b> @<i>{reg.email}</i>
      </h5>

      <h6>
        Register to class <b>{reg.className}</b>
      </h6>

      <span
        style={{
          backgroundColor: getColorForStatus(reg.status),
          padding: '5px 5px',
          minWidth: '200px',
        }}
      >
        {reg.status}
      </span>
      {reg.status === 'PENDING' && (
        <div>
          <button
            name={`${reg.userId}__${reg.classId}`}
            type='button'
            onClick={handleUpdateClick}
          >
            Change
          </button>
        </div>
      )}
    </article>
  );
};

const RegistrationListForAdmin = () => {
  const dispatch = useDispatch();
  const classes = useSelector(selectAllRegistrations);

  const classStatus = useSelector((state) => state.registrations.status);

  useEffect(() => {
    dispatch(fetchRegistrations());
  }, [dispatch]);

  const handleUpdateClick = (e) => {
    const [userId, classId] = e.target.name.split('__');
    const index = classes.findIndex(
      (item) => item.classId == classId && item.userId == userId
    );
    if (index === -1) return;
    setIsOpen(true);
    setSelectedRegistration(classes[index]);
  };

  let content;
  const [filter, setFilter] = useState('all');

  const filtered = useMemo(
    () => getFiltered(classes, filter),
    [classes, filter]
  );

  if (classStatus === 'loading') {
    content = <Spinner text='Loading...' />;
  }

  if (filtered.length) {
    content = filtered.map(
      (item) => 
        item && (
          <RegistrationExpert
            reg={item}
            key={`${item.userId}__${item.classId}`}
            handleUpdateClick={handleUpdateClick}
          />
        )
    );
  }

  const [modalIsOpen, setIsOpen] = useState(false);
  const [selectedRegistration, setSelectedRegistration] = useState(null);

  const afterOpenModal = () => {
    // references are now sync'd and can be accessed.
    // subtitle.style.color = '#f00';
  };

  return (
    <section className='posts-list'>
      <h2>All registrations</h2>
      <StatusFilter onChange={({ value }) => setFilter(value)} />
      {content}
      <UpdateStatusModal
        isOpen={modalIsOpen}
        closeModal={() => setIsOpen(false)}
        onAfterOpen={afterOpenModal}
        label='Edit'
        registration={selectedRegistration}
      />
    </section>
  );
};

export default RegistrationListForAdmin;
