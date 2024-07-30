import React, { useState, useEffect } from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Button, TextField, Select, MenuItem, FormControl, InputLabel
} from '@mui/material';
import { db } from '../services/firebase';
import { collection, query, where, orderBy, limit, startAfter, getDocs } from 'firebase/firestore';

const ITEMS_PER_PAGE = 10;

function DepositList() {
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastVisible, setLastVisible] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [filterName, setFilterName] = useState('');

  useEffect(() => {
    fetchDeposits();
  }, [sortField, sortDirection, filterName]);

  const fetchDeposits = async (loadMore = false) => {
    setLoading(true);
    let q = query(
      collection(db, 'deposits'),
      where('userId', '==', 'current-user-id'),
      orderBy(sortField, sortDirection),
      limit(ITEMS_PER_PAGE)
    );

    if (filterName) {
      q = query(q, where('name', '>=', filterName), where('name', '<=', filterName + '\uf8ff'));
    }

    if (loadMore && lastVisible) {
      q = query(q, startAfter(lastVisible));
    } else {
      setDeposits([]);
    }

    const querySnapshot = await getDocs(q);
    const newDeposits = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    setDeposits(prevDeposits => [...prevDeposits, ...newDeposits]);
    setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
    setHasMore(querySnapshot.docs.length === ITEMS_PER_PAGE);
    setLoading(false);
  };

  const handleSort = (field) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  return (
    <div>
      <FormControl fullWidth>
        <TextField
          label="Filter by Name"
          value={filterName}
          onChange={(e) => setFilterName(e.target.value)}
          margin="normal"
        />
      </FormControl>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell onClick={() => handleSort('date')}>Date</TableCell>
              <TableCell onClick={() => handleSort('name')}>Name</TableCell>
              <TableCell onClick={() => handleSort('amount')}>Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {deposits.map(deposit => (
              <TableRow key={deposit.id}>
                <TableCell>{new Date(deposit.date).toLocaleDateString()}</TableCell>
                <TableCell>{deposit.name}</TableCell>
                <TableCell>${deposit.amount.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {loading && <div>Loading deposits...</div>}
      {hasMore && !loading && (
        <Button onClick={() => fetchDeposits(true)} variant="contained" color="primary">
          Load More
        </Button>
      )}
    </div>
  );
}

export default DepositList;
