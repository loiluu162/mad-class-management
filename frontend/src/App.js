import { Switch, Route, BrowserRouter as Router } from 'react-router-dom';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import Navbar from './components/navbar';
import Home from './pages/home';
import Profile from './pages/profile';
import About from './pages/about';
import Login from './features/auth/login';
import ProtectedRoute from './components/protectedRoute';
import Signup from './features/auth/signup';
import VerifyEmail from './features/auth/verifyEmail';
import ForgotPassword from './features/auth/forgotPassword';
import NotForLoggedInRoute from './components/notForLoggedInRoute';
import { Toaster } from 'react-hot-toast';
import ChangePassword from './features/auth/changePassword';
import ResetPassword from './features/auth/resetPassword';
import ClassManage from './pages/admin/class';
import UserClass from './pages/user/class';
import UserRegistration from './pages/user/registration';
import RegistrationManage from './pages/admin/registration';
import EditClass from './features/classes/editClass';
import SingleClassPage from './features/classes/singleClass';

function App() {
  return (
    <>
      <div className='App'>
        <Navbar />
        <div className='auth-wrapper'>
          <div className='auth-inner'>
            <Switch>
              <ProtectedRoute path='/' exact component={Home} />
              <ProtectedRoute path='/profile' exact component={Profile} />
              <Route path='/about' exact component={About} />
              {/* login route */}
              <NotForLoggedInRoute path='/login' exact component={Login} />
              <NotForLoggedInRoute path='/signup' exact component={Signup} />
              <NotForLoggedInRoute
                path='/verifyEmail'
                exact
                component={VerifyEmail}
              />
              <NotForLoggedInRoute
                path='/forgotPassword'
                exact
                component={ForgotPassword}
              />
              <NotForLoggedInRoute
                path='/resetPassword'
                exact
                component={ResetPassword}
              />
              <ProtectedRoute
                path='/changePassword'
                exact
                component={ChangePassword}
              />
              {/* admin route */}
              <ProtectedRoute
                requireRoles={['ROLE_ADMIN']}
                path='/admin/classes'
                exact
                component={ClassManage}
              />
              <ProtectedRoute
                requireRoles={['ROLE_ADMIN']}
                path='/admin/registration'
                exact
                component={RegistrationManage}
              />
              <ProtectedRoute
                requireRoles={['ROLE_ADMIN']}
                path='/admin/classes/:classId'
                exact
                component={SingleClassPage}
              />
              <ProtectedRoute
                requireRoles={['ROLE_ADMIN']}
                path='/admin/editClass/:classId'
                exact
                component={EditClass}
              />
              {/* user route */}
              <ProtectedRoute path='/class' exact component={UserClass} />
              <ProtectedRoute
                path='/registration'
                exact
                component={UserRegistration}
              />
            </Switch>
          </div>
        </div>
        <Toaster />
      </div>
    </>
  );
}

export default App;
