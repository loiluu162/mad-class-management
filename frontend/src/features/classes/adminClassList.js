import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

// import { ReactionButtons } from './ReactionButtons';
import { deleteClass, fetchClasses, selectAllClasses } from './classSlice';
import { Spinner } from '../../components/spinner';
import { confirm, sortDays } from '../../utils';

const ClassExcerpt = ({ classItem, handleDeleteClass }) => {
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
        <p>
          Current{' '}
          <b>
            {(classItem.students && classItem.students.length) || '0'}/
            {classItem.maxStudents}
          </b>{' '}
          accepted
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
        <Link
          to={`/admin/classes/${classItem.id}`}
          className='button muted-button'
        >
          View Class
        </Link>
        <button
          name={classItem.id}
          onClick={handleDeleteClass}
          className='button muted-button'
        >
          Delete
        </button>
      </article>
    </div>
  );
};

export const AdminClassesList = () => {
  const dispatch = useDispatch();
  const classes = useSelector(selectAllClasses);

  const classStatus = useSelector((state) => state.classes.status);

  useEffect(() => {
    dispatch(fetchClasses());
  }, []);

  const handleDeleteClass = (e) => {
    confirm({ handleYes: () => dispatch(deleteClass({ id: e.target.name })) });
  };

  let content;

  if (classStatus === 'loading') {
    content = <Spinner text='Loading...' />;
  }

  if (classes.length) {
    content = classes.map(
      (item) =>
        item && (
          <ClassExcerpt
            key={item.id}
            classItem={item}
            handleDeleteClass={handleDeleteClass}
          />
        )
    );
  }

  return (
    <section className='posts-list'>
      <h2>All Classes</h2>
      {content}
    </section>
  );
};

export default AdminClassesList;
