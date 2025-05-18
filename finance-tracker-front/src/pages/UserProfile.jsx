import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserProfile } from '../../src/store/AuthSlice';

const UserProfile = () => {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getUserProfile());
  }, [dispatch]);

  if (loading) return <div>Loading profile...</div>;
  if (error) return <div>Error loading profile: {error}</div>;

  return (
    <div className="container">
      <h2>User Profile</h2>
      {user ? (
        <div className="card">
          <div className="card-content">
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
          </div>
        </div>
      ) : (
        <div>No user data available</div>
      )}
    </div>
  );
};

export default UserProfile;
