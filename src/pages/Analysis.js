import React from 'react';
import { Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import DepositList from '../components/DepositList';
import Summary from '../components/Summary';

function Analysis() {
  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Deposit Analysis
      </Typography>
      <Summary />
      <DepositList />
      <Button component={Link} to="/" variant="contained" color="secondary">
        Back to Home
      </Button>
    </div>
  );
}

export default Analysis;
