import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

// import { ReactionButtons } from './ReactionButtons';
import { fetchClasses, selectAllClasses } from './classSlice';
import { Spinner } from '../../components/spinner';

const ClassExcerpt = ({ classItem }) => {
  return (
    <article className='post-excerpt' key={classItem.id}>
      <h3>{classItem.name}</h3>
      <Link
        to={`/admin/classes/${classItem.id}`}
        className='button muted-button'
      >
        View Class
      </Link>
    </article>
  );
};

export const ClassesList = () => {
  const dispatch = useDispatch();
  const classes = useSelector(selectAllClasses);

  const classStatus = useSelector((state) => state.classes.status);

  const error = useSelector((state) => state.classes.error);

  useEffect(() => {
    dispatch(fetchClasses());
  }, [dispatch]);

  let content;

  if (classStatus === 'loading') {
    content = <Spinner text='Loading...' />;
  }

  if (classes.length) {
    content = classes.map(
      (item) => item && <ClassExcerpt key={item.id} classItem={item} />
    );
  }

  return (
    <section className='posts-list'>
      <h2>All Classes</h2>
      {content}
    </section>
  );
};

export default ClassesList;
