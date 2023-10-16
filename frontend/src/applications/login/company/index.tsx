import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import Logo from "@/shared/assets/LinkedOut-Logo.svg";
import axios from 'axios';
import { useMutation } from 'react-query';
import { useState } from 'react';
import { Alert, LoadingButton } from '@mui/lab';

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

type ResponeType = {
  data: {
    student: {
      id: string;
      name: string;
      email: string;
      phoneNumber: string;
      avatar: string;
      isGoogle: boolean;
      isVerify: boolean;
    };
    token: string;
  };
}

type ErrorType = {
  response: {
    data: {
      message: string;
    }
  }
}

interface loginForm {
  email: string;
  password: string;
}

export default function CompanyLogin() {
  const navigate = useNavigate();
  const [sending, setSending] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // Handle input change
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Mutation to send login information
  const mutation = useMutation<ResponeType, ErrorType, loginForm>({
    mutationFn: (loginForm) => axios.post("http://localhost:5000/api/v1/company/login", loginForm),
    onSuccess: (data) => {
      console.log(data);
      const token = data.data.token;
      document.cookie = `jwtToken=${token}; expires=${new Date(Date.now() + 60 * 60 * 1000)}; path=/`;
      setSending(false);
      setShowError(false);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false); // Hide the success message
        navigate('/company'); // Navigate to the next screen
      }, 1000);
    },
    onError: (error) => {
      setSending(false);
      setShowError(true);
      console.log(error);
    },
    onMutate: () => {
      console.log(formData);
      setSending(true);
      setShowError(false);
    }
  }
  );

  // Handle submit
  const handleSubmitSignIn = (event: React.FormEvent) => {
    event.preventDefault();
    mutation.mutate(formData);
  };




  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: 'auto' }} className='justify-center items-center my-auto absolute top-0 bottom-0 left-0 right- bg-[url(https://source.unsplash.com/random?wallpapers)] bg-cover'>
        <CssBaseline />

        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square className='rounded-xl'>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}

          >

            <img
              src={Logo}
              className='w-1/5 h-1/5 rounded-full mb-4'
            />
            <Typography component="h1" variant="h5">
              Login with student account
            </Typography>
            <Box component="form" onSubmit={handleSubmitSignIn} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                type="email"
                autoFocus
                onChange={handleInputChange}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                onChange={handleInputChange}
              />
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />
              <LoadingButton
                loading={sending}
                fullWidth
                type="submit"
                variant="contained"
                disabled={showSuccess}
                sx={{ mt: 2, mb: 2 }}
              >
                Log in
              </LoadingButton>
              {showError && <Alert sx={{ mb: 2 }} severity="error">{mutation.error?.response.data.message}</Alert>}
              {showSuccess && <Alert sx={{ mb: 2 }} severity="success">Success</Alert>}
              <Grid container>
                <Grid item xs>
                  <Link href="#" variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  <Link href="#" variant="body2">
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}