import React, { useState } from 'react';
import DatePicker from 'react-date-picker';
import { useDispatch } from 'react-redux';
// import { useHistory } from 'react-router-dom';
import { addNewClass } from './classSlice';

const AddClassForm = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [maxStudents, setMaxStudents] = useState(50);
  const [name, setName] = useState('');

  const dispatch = useDispatch();

  //   const history = useHistory();

  const onTitleChanged = (e) => setName(e.target.value);
  const onMaxStudentsChanged = (e) => setMaxStudents(e.target.value);
  const onStartDateChange = (date) => setStartDate(date);
  const onEndDateChange = (date) => setEndDate(date);

  const onSavePostClicked = (e) => {
    e.preventDefault();
    if (name && startDate && endDate && maxStudents) {
      dispatch(
        addNewClass({
          name,
          startDate,
          endDate,
          maxStudents,
        })
      );
      //   history.push(`/admin/classes`);
    }
  };

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

          {/* <input
            type='number'
            id='postContent'
            name='postContent'
            value={content}
            onChange={onContentChanged}
            className='form-control'
          /> */}
        </div>
        {/* <div className='form-group'>
          <label htmlFor='postContent'>Study Time</label>
          <input
            type='number'
            id='postContent'
            name='postContent'
            value={content}
            className='form-control'
            onChange={onContentChanged}
          />
        </div> */}
        <button type='submit'>Add Class</button>
      </form>
    </section>
  );
};

export default AddClassForm;
