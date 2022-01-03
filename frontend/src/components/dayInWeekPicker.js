import React, { useState } from 'react';
import Select from 'react-select';
import { days } from '../utils';

const DayInWeekPicker = ({ value, name, onChange }) => {
  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      padding: 15,
    }),
    control: (provided, state) => ({
      ...provided,
      width: '150px',
      display: 'flex',
    }),
    menu: (provided, state) => ({
      ...provided,
      width: '150px',
    }),
    container: (provided, state) => ({
      ...provided,
      width: '150px',
    }),
    singleValue: (provided, state) => {
      const opacity = state.isDisabled ? 0.5 : 1;
      const transition = 'opacity 300ms';

      return { ...provided, opacity, transition };
    },
  };

  const options = days.map((day) => ({ value: day, label: day }));
  
  return (
    <span>
      <Select
        name={name}
        styles={customStyles}
        options={options}
        value={value}
        onChange={onChange}
        required={true}
      ></Select>
    </span>
  );
};

export default DayInWeekPicker;
