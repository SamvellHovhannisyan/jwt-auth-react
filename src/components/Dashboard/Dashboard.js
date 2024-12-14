import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Typography, Grid, CircularProgress, Box } from '@mui/material';
import axios from 'axios';
import styles from '../../styles/Dashboard.module.scss';
const Dashboard = () => {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem('token');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      // Fetch user data from API
      axios
        .get(`${process.env.REACT_APP_BACKEND_API_URL}/user`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then((response) => {
          setUser(response.data.user);
          setLoading(false);
        })
        .catch((err) => {
          setError('Ошибка при загрузке данных пользователя');
          setLoading(false);
        });
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <Box className={styles.dashboard}>
      <Typography variant='h4' align='center' gutterBottom>
        Добро пожаловать!
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color='error' align='center'>
          {error}
        </Typography>
      ) : (
        <div>
          <Typography variant='h6' align='center'>
            Привет, {user?.name}!
          </Typography>
          <Typography variant='body1' align='center'>
            Ваш email: {user?.email}
          </Typography>
        </div>
      )}
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Button variant='contained' color='warning' onClick={handleLogout}>
          Выйти
        </Button>
      </Box>
    </Box>
  );
};

export default Dashboard;
