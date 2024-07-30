import React, { useState, useEffect, useCallback } from 'react';
import { db } from '../services/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { TextField, Paper, Typography } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function Summary() {
  const [summary, setSummary] = useState({
    totalDeposits: 0,
    averageDeposit: 0,
    largestDeposit: 0,
    depositCount: 0
  });
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchSummary = useCallback(async () => {
    setLoading(true);
    let q = query(collection(db, 'deposits'), where('userId', '==', 'current-user-id'));

    if (startDate) {
      q = query(q, where('date', '>=', new Date(startDate)));
    }
    if (endDate) {
      q = query(q, where('date', '<=', new Date(endDate)));
    }

    const querySnapshot = await getDocs(q);
    const deposits = querySnapshot.docs.map(doc => doc.data());

    const totalDeposits = deposits.reduce((sum, deposit) => sum + deposit.amount, 0);
    const depositCount = deposits.length;
    const averageDeposit = depositCount > 0 ? totalDeposits / depositCount : 0;
    const largestDeposit = deposits.reduce((max, deposit) => Math.max(max, deposit.amount), 0);

    setSummary({
      totalDeposits,
      averageDeposit,
      largestDeposit,
      depositCount
    });

    const chartData = deposits.reduce((acc, deposit) => {
      const date = new Date(deposit.date).toLocaleDateString();
      const existingEntry = acc.find(entry => entry.date === date);
      if (existingEntry) {
        existingEntry.amount += deposit.amount;
      } else {
        acc.push({ date, amount: deposit.amount });
      }
      return acc;
    }, []);

    setChartData(chartData.sort((a, b) => new Date(a.date) - new Date(b.date)));
    setLoading(false);
  }, [startDate, endDate]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  return (
    <Paper style={{ padding: '20px', marginBottom: '20px' }}>
      <Typography variant="h5" gutterBottom>Deposit Summary</Typography>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <TextField
          label="Start Date"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="End Date"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
      </div>
      {loading ? (
        <Typography>Loading summary...</Typography>
      ) : (
        <div>
          <Typography>Total Deposits: ${summary.totalDeposits.toFixed(2)}</Typography>
          <Typography>Average Deposit: ${summary.averageDeposit.toFixed(2)}</Typography>
          <Typography>Largest Deposit: ${summary.largestDeposit.toFixed(2)}</Typography>
          <Typography>Number of Deposits: {summary.depositCount}</Typography>
        </div>
      )}
      <div style={{ height: '300px', marginTop: '20px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="amount" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Paper>
  );
}

export default Summary;