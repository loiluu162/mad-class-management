import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { TimeAgo } from '../classes/timeAgo';
import { selectClassById } from '../classes/classSlice';
import { ClassAuthor } from '../classes/classAuthor';

export default function SingleClassPage({ match }) {
  const { classId } = match.params;
  const classItem = useSelector((state) =>
    selectClassById(state, Number.parseInt(classId))
  );
  if (!classItem) {
    return (
      <section>
        <h2>Class not found!</h2>
      </section>
    );
  }
  const {
    id,
    name,
    createdBy,
    createdAt,
    studyTimes,
    students,
    startDate,
    endDate,
    maxStudents,
  } = classItem;

  console.log(students);
  return (
    <section>
      <article className='class'>
        <h2>{name}</h2>
        <div>
          <ClassAuthor userId={createdBy} />
          <TimeAgo timestamp={createdAt} />
        </div>
        <div>
          <p>
            From <b>{new Date(startDate).toDateString()}</b> to
            <b> {new Date(endDate).toDateString()}</b>
          </p>
          <p>
            Current{' '}
            <b>
              {(students && students.length) || 0}/{maxStudents}
            </b>{' '}
            accepted
          </p>

          {studyTimes && studyTimes.length > 0 ? (
            <>
              <p>Study at</p>
              {studyTimes.map(
                ({ id, dayInWeek, startTime, endTime, classId }) => (
                  <li key={id}>
                    {dayInWeek} {startTime.substr(0, 5)} -{' '}
                    {endTime.substr(0, 5)}
                  </li>
                )
              )}
            </>
          ) : (
            <p>Not have any study time yet </p>
          )}
        </div>
        <div className='registration-list'>
          {students && students.length ? (
            <>
              <h3>List registration</h3>
              {students.map(({ email, name, id, photoUrl, registrations }) => (
                <li key={id}>
                  {name} | {email} {registrations.status}
                </li>
              ))}
            </>
          ) : (
            <p>Not have any student yet</p>
          )}
        </div>
        <Link to={`/admin/editClass/${id}`} className='button'>
          Edit Class
        </Link>
      </article>
    </section>
  );
}
