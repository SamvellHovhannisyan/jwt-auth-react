import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  TextField,
  Box,
  Typography,
  Link,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from '../../styles/Forms.module.scss';
import LoadingButton from '@mui/lab/LoadingButton';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const schema = yup.object({
  email: yup.string().email('Некорректный email').required('Email обязателен'),
  password: yup
    .string()
    .min(8, 'Пароль должен быть минимум 8 символов')
    .matches(/[A-Z]/, 'Пароль должен содержать хотя бы одну заглавную букву')
    .matches(/[a-z]/, 'Пароль должен содержать хотя бы одну строчную букву')
    .matches(/[0-9]/, 'Пароль должен содержать хотя бы одну цифру')
    .matches(
      /[!@#$%^&*(),.?":{}|<>]/,
      'Пароль должен содержать хотя бы один специальный символ',
    )
    .required('Пароль обязателен'),
});

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  const onSubmit = async (data) => {
    setIsSubmitted(true);
    try {
      await axios
        .post(`${process.env.REACT_APP_BACKEND_API_URL}/login`, {
          email: data.email,
          password: data.password,
        })
        .then((response) => {
          localStorage.setItem('token', response.data.token);
          navigate('/dashboard');
        });
    } catch (err) {
      const backendErrors = err.response?.data?.errors;
      if (
        backendErrors &&
        typeof backendErrors === 'object' &&
        Array.isArray(backendErrors)
      ) {
        Object.keys(backendErrors).forEach((field) => {
          setError(field, {
            type: 'server',
            message: backendErrors[field][0],
          });
        });
      } else {
        setError('form', {
          type: 'server',
          message:
            'Ошибка регистрации: ' +
            JSON.stringify(
              err.response?.data?.errors?.message ||
                err.response?.data?.message ||
                err.message,
            ),
        });
      }
    }
    setIsSubmitted(false);
  };

  return (
    <Box className={styles.container}>
      <Box className={styles.pageContent}>
        <Typography variant='h4' align='center'>
          Вход
        </Typography>
        {errors.form && errors.form.message && (
          <Typography color='error'>{errors.form.message}</Typography>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <TextField
            fullWidth
            label='Email'
            variant='outlined'
            {...register('email')}
            error={!!errors.email}
            helperText={errors.email?.message}
          />
          <TextField
            fullWidth
            label='Пароль'
            variant='outlined'
            type={showPassword ? 'text' : 'password'}
            {...register('password')}
            error={!!errors.password}
            helperText={errors.password?.message}
            InputProps={{
              endAdornment: (
                <InputAdornment position='end'>
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge='end'
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <LoadingButton
            size='medium'
            loading={isSubmitted}
            variant='contained'
            color='primary'
            fullWidth
            type='submit'
            disabled={isSubmitted}
          >
            Войти
          </LoadingButton>
        </form>
        <Typography align='center' sx={{ marginTop: 2 }}>
          Нет аккаунта?{' '}
          <Link href='/register' variant='body2'>
            Зарегистрироваться
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default Login;
