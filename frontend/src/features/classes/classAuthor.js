import React from 'react';
import { useSelector } from 'react-redux';

export const ClassAuthor = ({ userId }) => {
  // const author = useSelector((state) =>
  //   state.users.find((user) => user.id === userId)
  // );

  return <span>by ADMIN @{userId}</span>;
};
