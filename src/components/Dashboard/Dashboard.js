import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Typography, Grid } from '@mui/material';

const Dashboard = () => {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem('token');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <Grid container justifyContent='center' spacing={2}>
      <Grid item xs={12} md={6}>
        <Typography variant='h4' align='center' gutterBottom>
          Добро пожаловать!
        </Typography>
        <Button variant='contained' color='secondary' onClick={handleLogout}>
          Выйти
        </Button>
      </Grid>
    </Grid>
  );
};

export default Dashboard;
