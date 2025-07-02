'use client';

//THIS IS A TEST PAGE FOR USERS 
import { useSession } from 'next-auth/react';
import SignOut from '../../../pages/components/SignOut';
import SessionChecking from "../../component/SessionChecking";
export default function TestUserPage() {
  const { data: session, status } = useSession();

  return (
    <div style={{ padding: '2rem' }}>
      <h1> Testing User</h1>
      <SessionChecking />
      <SignOut />
      <p>Status: <strong>{status}</strong></p>
      {status === 'authenticated' ? (
        <div>
          <p><strong>Name:</strong> {session.user.name}</p>
          <p><strong>Email:</strong> {session.user.email}</p>
          <p><strong>Role:</strong> {session.user.role}</p>
          <p><strong>ID:</strong> {session.user.id}</p>
        </div>
      ) : (
        <p>No user session found.</p>
      )}
    </div>
  );
}
