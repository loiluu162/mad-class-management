import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

export const userHasAnyRoles = (userRoles, requireRoles) => {
  return userRoles.some((role) => requireRoles.includes(role));
};

export const days = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

export const sortDays = function (a, b) {
  a = days.indexOf(a);
  b = days.indexOf(b);
  return a < b ? 0 : 1;
};

export const confirm = ({
  handleYes,
  handleNo,
  title = 'Confirm',
  message = 'Are you sure to do this',
}) => {
  confirmAlert({
    title,
    message,
    buttons: [
      {
        label: 'Yes',
        onClick: handleYes,
      },
      {
        label: 'No',
        onClick: handleNo,
      },
    ],
  });
};
