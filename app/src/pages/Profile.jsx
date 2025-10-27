import React, { useEffect, useState } from 'react';
import API from '../api';

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await API.get('/profile');
        setUser(res.data);
      } catch (err) {
        window.location.href = '/login';
      }
    };
    fetchUser();
  }, []);

  if (!user) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-4">User Profile</h1>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Email Verified:</strong> {user.email_verified ? 'Yes' : 'No'}</p>
      <pre className="bg-gray-100 p-2 mt-4 rounded">{JSON.stringify(user, null, 2)}</pre>
    </div>
  );
};

export default Profile;
