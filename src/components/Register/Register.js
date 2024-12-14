import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  TextField,
  Button,
  Typography,
  Link,
  InputAdornment,
  IconButton,
  Box,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import * as yup from 'yup';
import styles from '../../styles/Forms.module.scss';
import { yupResolver } from '@hookform/resolvers/yup';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const schema = yup.object({
  email: yup.string().email('Некорректный email').required('Email обязателен'),
  name: yup
    .string()
    .required('Имя обязательно')
    .min(3, 'Имя должно быть минимум 3 символа')
    .max(20, 'Имя должно быть максимум 20 символов'),
  password: yup
    .string()
    .min(8, 'Пароль должен быть минимум 8 символов')
    .matches(/[A-Z]/, 'Пароль должен содержать хотя бы одну заглавную букву')
    .matches(/[a-z]/, 'Пароль должен содержать хотя бы одну строчную букву')
    .matches(/[0-9]/, 'Пароль должен содержать хотя бы одну цифру')
    .matches(
      /[!@#$%^&*(),.?":{}|<>`]/,
      'Пароль должен содержать хотя бы один специальный символ',
    ) // Добавлен символ `
    .required('Пароль обязателен'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Пароли не совпадают')
    .required('Подтверждение пароля обязательно'),
});

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_API_URL}/register`, {
        email: data.email,
        name: data.name,
        password: data.password,
        password_confirmation: data.confirmPassword,
      });
      navigate('/login');
    } catch (err) {
      const backendErrors = err.response?.data?.errors;

      if (backendErrors && typeof backendErrors === 'object') {
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
            JSON.stringify(err.response?.data?.message || err.message),
        });
      }
    }
  };

  return (
    <Box className={styles.container}>
      <Box className={styles.pageContent}>
        <Typography variant='h4' align='center' gutterBottom>
          Регистрация
        </Typography>
        {errors.form && errors.form.message && (
          <Typography color='error'>{errors.form.message}</Typography>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <TextField
            fullWidth
            label='Name'
            variant='outlined'
            {...register('name')}
            error={!!errors.name}
            helperText={errors.name?.message}
          />
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
          <TextField
            fullWidth
            label='Подтвердите пароль'
            variant='outlined'
            type={showConfirmPassword ? 'text' : 'password'}
            {...register('confirmPassword')}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
            InputProps={{
              endAdornment: (
                <InputAdornment position='end'>
                  <IconButton
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    edge='end'
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button type='submit' variant='contained' color='primary'>
            Зарегистрироваться
          </Button>
        </form>
        <Typography align='center'>
          Уже есть аккаунт?{' '}
          <Link href='/login' variant='body2'>
            Войдите
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default Register;
