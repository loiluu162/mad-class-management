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

  return (
    <section>
      <article className='class'>
        <h2>{classItem.name}</h2>
        <div>
          <ClassAuthor userId={classItem.createdBy} />
          <TimeAgo timestamp={classItem.createdAt} />
        </div>
        <p className='post-content'>{classItem.name}</p>
        {/* <ReactionButtons post={classItem} /> */}
        <Link to={`/admin/editClass/${classItem.id}`} className='button'>
          Edit Class
        </Link>
      </article>
    </section>
  );
}
