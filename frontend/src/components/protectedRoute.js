import React from 'react';
import { useSelector } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';
import {
  selectCurrentUser,
  selectLoggedInStatus,
} from '../features/auth/authSlice';
import { userHasAnyRoles } from '../utils';

const ProtectedRoute = ({ component: Component, requireRoles, ...rest }) => {
  const loggedIn = useSelector(selectLoggedInStatus);
  const { roles = [] } = useSelector(selectCurrentUser);

  return (
    <Route
      {...rest}
      render={(props) => {
        if (!loggedIn) {
          return (
            <Redirect
              to={{ pathname: '/login', state: { from: props.location } }}
            />
          );
        }
        // check if route is restricted by role
        if (requireRoles && !userHasAnyRoles(roles, requireRoles)) {
          // role not authorised so redirect to home page
          return <Redirect to={{ pathname: '/' }} />;
        }
        // authorized so return component
        return <Component {...props} />;
      }}
    />
  );
};

export default ProtectedRoute;
