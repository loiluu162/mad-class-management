import React from 'react';
import { useSelector } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';
import { selectLoggedInStatus } from '../features/auth/authSlice';
// import { useAuth } from '../lib/hooks';

const NotForLoggedInRoute = ({ component: Component, ...rest }) => {
  const loggedIn = useSelector(selectLoggedInStatus);

  return (
    <Route
      {...rest}
      render={(props) => {
        if (!loggedIn) {
          return <Component {...rest} {...props} />;
        }
        return (
          <Redirect
            to={{
              pathname: '',
              state: {
                from: props.location,
              },
            }}
          />
        );
      }}
    />
  );
};

export default NotForLoggedInRoute;
