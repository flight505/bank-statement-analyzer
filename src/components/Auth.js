import React, { useState, useEffect } from 'react';
import { Button, Typography } from '@mui/material';
import { auth } from '../services/firebase';
import { signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';

function Auth() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const signIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      setError(null);
    } catch (error) {
      console.error('Error signing in with Google', error);
      setError(`Error signing in: ${error.message} (${error.code})`);
    }
  };

  const signOutUser = async () => {
    try {
      await signOut(auth);
      setError(null);
    } catch (error) {
      console.error('Error signing out', error);
      setError(`Error signing out: ${error.message}`);
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
      {error && <Typography color="error">{error}</Typography>}
    </div>
  );
}

export default Auth;