import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectClassById, classUpdated, classUpdate } from './classSlice';
import { Link } from 'react-router-dom';
import { TimeAgo } from './timeAgo';
import { ClassAuthor } from './classAuthor';
import { useHistory } from 'react-router-dom';
import DatePicker from 'react-date-picker';
import { StudyTimeGroup } from './studyTimeGroup';
import { confirm } from '../../utils';

const EditClass = ({ match }) => {
  const { classId } = match.params;

  const classItem = useSelector((state) =>
    selectClassById(state, Number.parseInt(classId))
  );

  const [startDate, setStartDate] = useState(new Date(classItem.startDate));
  const [endDate, setEndDate] = useState(new Date(classItem.endDate));
  const [maxStudents, setMaxStudents] = useState(classItem.maxStudents);
  const [name, setName] = useState(classItem.name);
  const [studyTimes, setStudyTimes] = useState(
    classItem.studyTimes.map(({ ...attrs }) => ({ existed: true, ...attrs }))
  );

  const dispatch = useDispatch();

  const history = useHistory();

  const onTitleChanged = (e) => setName(e.target.value);
  const onMaxStudentsChanged = (e) => setMaxStudents(e.target.value);
  const onStartDateChange = (date) => setStartDate(date);
  const onEndDateChange = (date) => setEndDate(date);

  const onSavePostClicked = (e) => {
    e.preventDefault();
    // console.log(studyTimes);
    const editStudyTimes = studyTimes.map(({ id, existed, ...attrs }) => {
      if (existed) {
        return { id, ...attrs };
      }
      return { ...attrs };
    });
    if (name && startDate && endDate && maxStudents) {
      confirm({
        handleYes: () => {
          dispatch(
            classUpdate({
              id: classId,
              name,
              startDate,
              endDate,
              maxStudents,
              studyTimes: editStudyTimes,
            })
          )
            .unwrap()
            .then(() => {
              dispatch(
                classUpdate({
                  id: classId,
                  name,
                  startDate,
                  endDate,
                  maxStudents,
                  studyTimes: editStudyTimes,
                })
              );
              history.push(`/admin/classes/${classId}`);
            });
        },
      });
    }
  };
  if (!classItem) {
    return (
      <section>
        <h2>Class not found!</h2>
      </section>
    );
  }
  return (
    <section>
      <h2>Edit Class</h2>
      <form onSubmit={onSavePostClicked}>
        <div className='form-group'>
          <label htmlFor='postTitle'>Class name:</label>
          <input
            type='text'
            id='postTitle'
            name='postTitle'
            placeholder="What's your class name?"
            value={name}
            onChange={onTitleChanged}
            className='form-control'
          />
        </div>
        <div className='form-group'>
          <label htmlFor='postContent'>Max students</label>
          <input
            type='number'
            id='postContent'
            name='postContent'
            value={maxStudents}
            onChange={onMaxStudentsChanged}
            className='form-control'
          />
        </div>
        <div className='form-group'>
          <label htmlFor='postContent'>Start Date</label>
          <DatePicker
            className='form-control'
            onChange={onStartDateChange}
            value={startDate}
          />
        </div>
        <div className='form-group'>
          <label htmlFor='postContent'>End Date</label>
          <DatePicker
            className='form-control'
            onChange={onEndDateChange}
            value={endDate}
          />
        </div>
        <StudyTimeGroup studyTimes={studyTimes} setStudyTimes={setStudyTimes} />
        <button type='submit'>Save Class</button>
      </form>
    </section>
  );
};

export default EditClass;
