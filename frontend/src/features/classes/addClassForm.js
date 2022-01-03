import React, { useState } from 'react';
import DatePicker from 'react-date-picker';
import { useDispatch } from 'react-redux';
// import { useHistory } from 'react-router-dom';
import { addNewClass } from './classSlice';
import TimePicker from 'react-time-picker';
import DayInWeekPicker from '../../components/dayInWeekPicker';

import { toast } from 'react-hot-toast';
import { StudyTimeGroup } from './studyTimeGroup';

const AddClassForm = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [maxStudents, setMaxStudents] = useState(50);
  const [name, setName] = useState('');
  const [studyTimes, setStudyTimes] = useState([
    { id: 0, dayInWeek: '', startTime: '', endTime: '' },
  ]);

  const dispatch = useDispatch();

  const onTitleChanged = (e) => setName(e.target.value);
  const onMaxStudentsChanged = (e) => setMaxStudents(e.target.value);
  const onStartDateChange = (date) => setStartDate(date);
  const onEndDateChange = (date) => setEndDate(date);

  const [loading, setLoading] = useState(false);

  const onSavePostClicked = (e) => {
    e.preventDefault();
    if (name && startDate && endDate && maxStudents) {
      const newStudyTimes = studyTimes.map(({ id, ...keepAttrs }) => keepAttrs);
      dispatch(
        addNewClass({
          name,
          startDate,
          endDate,
          maxStudents,
          studyTimes: newStudyTimes,
        })
      )
        .unwrap()
        .then((_) => {
          setLoading(false);
          toast.success('Successfully added new class');
          setStartDate(new Date());
          setEndDate(new Date());
          setMaxStudents(50);
          setName('');
          setStudyTimes([]);
        })
        .catch((_) => {
          setLoading(false);
          toast.error('Error');
        });
    }
  };

  return (
    <section>
      <h2>Add Class</h2>
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
            required
          />
        </div>
        <div className='form-group'>
          <label>Max students</label>
          <input
            type='number'
            id='postContent'
            name='postContent'
            value={maxStudents}
            onChange={onMaxStudentsChanged}
            className='form-control'
            required
          />
        </div>
        <div className='form-group'>
          <label>Start Date</label>
          <DatePicker
            className='form-control'
            onChange={onStartDateChange}
            value={startDate}
            required
          />
        </div>
        <div className='form-group'>
          <label>End Date</label>
          <DatePicker
            className='form-control'
            onChange={onEndDateChange}
            value={endDate}
            required
          />
        </div>

        <StudyTimeGroup studyTimes={studyTimes} setStudyTimes={setStudyTimes} />

        <button type='submit'>Add Class</button>
      </form>
    </section>
  );
};

export default AddClassForm;
