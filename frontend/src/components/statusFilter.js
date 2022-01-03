import React from 'react';
import Select from 'react-select';

const StatusFilter = ({ value, onChange }) => {
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
  const options = [
    { value: 'REJECT', label: 'Reject' },
    { value: 'ACCEPT', label: 'Accept' },
    { value: 'PENDING', label: 'Pending' },
    { value: 'all', label: 'All' },
    { value: 'CANCELED', label: 'Canceled' },
  ];

  return (
    <span>
      <Select
        styles={customStyles}
        options={options}
        value={value}
        onChange={onChange}
        required={true}
      ></Select>
    </span>
  );
};

export default StatusFilter;
