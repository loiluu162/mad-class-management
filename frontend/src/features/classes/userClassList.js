import React, { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Spinner } from '../../components/spinner';
import {
  fetchClassesWithMyStatus,
  registerClass,
  selectAllClasses,
  cancelRegistration,
} from './classSlice';
import Select from 'react-select';
import StatusFilter from '../../components/statusFilter';
const ClassExcerpt = ({
  classItem,
  handleRegisterClass,
  handleCancelRegisterClass,
}) => {
  return (
    <div>
      <article className='post-excerpt' key={classItem.id}>
        <h3>{classItem.name}</h3>
        <p>
          Start at <b>{new Date(classItem.startDate).toDateString()}</b>
        </p>
        <p>
          End at <b>{new Date(classItem.endDate).toDateString()}</b>
        </p>
        {classItem.studyTimes &&
        classItem.studyTimes.length > 0 &&
        classItem.studyTimes[0].dayInWeek ? (
          <>
            <p>Study at</p>
            {classItem.studyTimes.map(
              ({ id, dayInWeek, startTime, endTime, classId }) => (
                <li key={id}>
                  {dayInWeek} {startTime.substr(0, 5)} - {endTime.substr(0, 5)}
                </li>
              )
            )}
          </>
        ) : (
          <p>Not have any study time yet </p>
        )}
        {!classItem.regStatus ? (
          <button
            type='button'
            onClick={handleRegisterClass}
            name={classItem.id}
          >
            Register Class
          </button>
        ) : classItem.regStatus === 'PENDING' ? (
          <button
            type='button'
            name={classItem.id}
            onClick={handleCancelRegisterClass}
          >
            Cancel Register
          </button>
        ) : (
          <div>{classItem.regStatus}</div>
        )}
      </article>
    </div>
  );
};

export const getFiltered = (list, status) => {
  if (status === 'all') return list;
  return list.filter((item) => item.regStatus === status || item.status === status);
};

const UserClassList = () => {
  const dispatch = useDispatch();
  const classes = useSelector(selectAllClasses);
  const [filter, setFilter] = useState('all');
  const classStatus = useSelector((state) => state.classes.status);

  useEffect(() => {
    dispatch(fetchClassesWithMyStatus());
  }, []);

  let content;
  const filtered = useMemo(
    () => getFiltered(classes, filter),
    [classes, filter]
  );
  const handleCancelRegisterClass = (e) => {
    dispatch(cancelRegistration({ classId: e.target.name }))
      .unwrap()
      .then(() => {
        toast.success('Registration canceled');
      })
      .catch(() => toast.error('Error'));
  };
  const handleRegisterClass = (e) => {
    dispatch(registerClass({ classId: e.target.name }))
      .unwrap()
      .then(() => {
        toast.success('Registered');
      })
      .catch(() => toast.error('Error'));
  };
  if (classStatus === 'loading') {
    content = <Spinner text='Loading...' />;
  }

  content = filtered.length ? (
    filtered.map(
      (item) =>
        item && (
          <ClassExcerpt
            key={item.id}
            classItem={item}
            handleCancelRegisterClass={handleCancelRegisterClass}
            handleRegisterClass={handleRegisterClass}
          />
        )
    )
  ) : (
    <div>Empty</div>
  );
  return (
    <section className='posts-list'>
      <h4>Status</h4>
      <StatusFilter onChange={({ value }) => setFilter(value)} />
      {content}
    </section>
  );
};

export default UserClassList;
