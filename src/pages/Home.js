import React from 'react';
import { Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import ImageUpload from '../components/ImageUpload';

function Home() {
  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Bank Statement Analyzer
      </Typography>
      <ImageUpload />
      <Button component={Link} to="/analysis" variant="contained" color="primary">
        View Analysis
      </Button>
    </div>
  );
}

export default Home;
