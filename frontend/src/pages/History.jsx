import React from 'react';
import { Navigate } from 'react-router-dom';
import AdminHistory from './AdminHistory';
import UserHistory from './UserHistory';

export default function History() {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <>
      {user ? (
        user.role === 'admin' ? <AdminHistory/> : <UserHistory />
      ) : (
        <Navigate to="/login" />
      )}
    </>
  );
}