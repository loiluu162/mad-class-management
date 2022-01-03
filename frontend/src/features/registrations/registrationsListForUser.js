import React, { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { Spinner } from '../../components/spinner';
import StatusFilter from '../../components/statusFilter';
import { getFiltered } from '../classes/userClassList';
import { getColorForStatus } from './registrationListForAdmin';
import {
  cancelRegistration,
  fetchMyRegistrations,
  selectAllRegistrations,
} from './registrationSlice';

const RegistrationExpert = ({ reg, handleCancelRegisterClass }) => {
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
            name={reg.classId}
            type='button'
            onClick={handleCancelRegisterClass}
          >
            Cancel
          </button>
        </div>
      )}
    </article>
  );
};

const RegistrationListForUser = () => {
  const dispatch = useDispatch();
  const classes = useSelector(selectAllRegistrations);

  const classStatus = useSelector((state) => state.registrations.status);

  useEffect(() => {
    dispatch(fetchMyRegistrations());
  }, []);

  const handleCancelRegisterClass = (e) => {
    dispatch(cancelRegistration({ classId: e.target.name }))
      .unwrap()
      .then(() => {
        toast.success('Registration canceled');
      })
      .catch(() => toast.error('Error'));
  };
  const [filter, setFilter] = useState('all');

  const filtered = useMemo(
    () => getFiltered(classes, filter),
    [classes, filter]
  );
  let content;

  if (classStatus === 'loading') {
    content = <Spinner text='Loading...' />;
  }
  content = filtered.length ? (
    filtered.map(
      (item) =>
        item && (
          <RegistrationExpert
            reg={item}
            key={`${item.userId}__${item.classId}`}
            handleCancelRegisterClass={handleCancelRegisterClass}
          />
        )
    )
  ) : (
    <div> Empty </div>
  );

  return (
    <section className='posts-list'>
      <h2>All registrations</h2>
      <StatusFilter onChange={({ value }) => setFilter(value)} />
      {content}
    </section>
  );
};

export default RegistrationListForUser;
