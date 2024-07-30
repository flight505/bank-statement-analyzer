import React, { useEffect } from 'react';
import { Button, Typography } from '@mui/material';
import { auth } from '../services/firebase';
import { signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';

function Auth({ user, setUser, setError }) {
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setUser(user);
    });

    return () => unsubscribe();
  }, [setUser]);

  const signIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      setError('Error signing in with Google');
      console.error('Error signing in with Google', error);
    }
  };

  const signOutUser = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      setError('Error signing out');
      console.error('Error signing out', error);
    }
  };

  return (
    <div>
      {user ? (
        <div>
          <Typography>Welcome, {user.displayName}</Typography>
          <Button onClick={signOutUser} variant="contained" color="secondary">Sign Out</Button>
        </div>
      ) : (
        <Button onClick={signIn} variant="contained" color="primary">Sign In with Google</Button>
      )}
    </div>
  );
}

export default Auth;
