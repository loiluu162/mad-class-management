import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { blockUser, fetchUsers, selectAllUsers } from './userSlice';
import './userList.css';
import { Link, useHistory } from 'react-router-dom';
import { confirm } from '../../utils';

const UserExpert = ({ user, handleUnblock, handleBlock }) => {
  return (
    <tr>
      <td>{user.id}</td>
      <td>
        <Link to={`/profile/${user.id}`}>
          <img src={user.photoUrl} className='avatar' alt={user.id} />
          {user.name}
        </Link>
      </td>
      <td>{user.email}</td>
      <td>{new Date(user.createdAt).toLocaleDateString()}</td>
      <td>
        {user.roles &&
          user.roles.map(({ name }) => (
            <span key={user.id + name}>{name} </span>
          ))}
      </td>
      <td>
        <span
          className={`status ${user.blocked ? 'text-warning' : 'text-success'}`}
        >
          &bull;
        </span>
        {user.blocked ? 'blocked' : 'available'}
      </td>
      <td>
        {user.blocked ? (
          <button className='settings' title='Unblock' data-toggle='tooltip'>
            <span
              onClick={() => handleUnblock(user.id)}
              name={user.id}
              className='material-icons'
            >
              block
            </span>
          </button>
        ) : (
          <button className='delete' title='Block' data-toggle='tooltip'>
            <span
              onClick={() => handleBlock(user.id)}
              name={user.id}
              className='material-icons'
            >
              block
            </span>
          </button>
        )}
      </td>
    </tr>
  );
};

const UsersList = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchUsers());
  }, []);
  const history = useHistory();
  const users = useSelector(selectAllUsers);
  //   return <div>{users.length && users.map((user) => <p>{user.name}</p>)}</div>;

  const handleBlock = (userId) => {
    confirm({
      handleYes: () => dispatch(blockUser({ blocked: true, userId })),
    });
  };
  const handleUnblock = (userId) => {
    confirm({
      handleYes: () => dispatch(blockUser({ blocked: false, userId })),
    });
  };

  return (
    <div className='container-xl'>
      <div className='table-responsive'>
        <div className='table-wrapper'>
          <div className='table-title'>
            <div className='row'>
              <div className='col-sm-5'>
                <h2>User Management</h2>
              </div>
              <div className='col-sm-7'>
                <button
                  className='btn btn-secondary'
                  onClick={() => history.push('users/new')}
                >
                  <i className='material-icons'>&#xE147;</i>
                  <span>Add New User</span>
                </button>
                <button className='btn btn-secondary' disabled>
                  <i className='material-icons'>&#xE24D;</i>
                  <span>Export to Excel</span>
                </button>
              </div>
            </div>
          </div>
          <table className='table table-striped table-hover'>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Date Created</th>
                <th>Role</th>
                <th>Blocked?</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <UserExpert
                  key={user.id}
                  user={user}
                  handleUnblock={handleUnblock}
                  handleBlock={handleBlock}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UsersList;
