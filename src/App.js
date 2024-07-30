import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Container, Snackbar } from '@mui/material';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Analysis from './pages/Analysis';
import Auth from './components/Auth';

const theme = createTheme();

function App() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Container>
          <Auth user={user} setUser={setUser} setError={setError} />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route 
              path="/analysis" 
              element={user ? <Analysis /> : <Navigate to="/" replace />} 
            />
          </Routes>
        </Container>
      </Router>
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        message={error}
      />
    </ThemeProvider>
  );
}

export default App;
