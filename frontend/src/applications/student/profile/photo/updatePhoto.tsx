import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useMutation, useQuery } from "react-query";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import Alert from '@mui/material/Alert';
import { useEffect, useState } from 'react';
import LoadingButton from '@mui/lab/LoadingButton';
import MenuItem from '@mui/material/MenuItem';
import InputAdornment from '@mui/material/InputAdornment';

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

type ResposeType = {
  data: {
    id: string;
    name: string;
    email: string;
    phoneNumber: string;
    avatar: string;
    isGoogle: boolean;
    isVerify: boolean;

  };
}

type ErrorType = {
  response: {
    data: {
      message: string;
    }
  }
}

interface updateForm {
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
  newPassword: string;
}

const countryCode = [
  {
    label: 'VNM',
    numberPrefix: '+84',
  },
  {
    label: 'AUS',
    numberPrefix: '+61',
  },
  {
    label: 'USA',
    numberPrefix: '+1',
  },
  {
    label: 'JPN',
    numberPrefix: '+81',
  },
];

export default function UpdatePhoto() {
  const navigate = useNavigate();
  const [sending, setSending] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [studentId, setStudentId] = useState('');

  const [country, countryChange] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    newPassword: '',
    phoneNumber: '',
  });

  // Get jwt token
  const getJwtToken = () => {
    return document.cookie.split("; ").find((cookie) => cookie.startsWith("jwtToken="))?.split("=")[1];
  };

  const token = getJwtToken();

  // Fetch current information
  useQuery({
    queryKey: "currentInfo",
    queryFn: () => axios.get("http://localhost:5000/api/v1/student/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
    onSuccess: (data) => {
      console.log(data);
      // Set student id
      setStudentId(data.data.id);

      // Set form data
      if (formData.name === '' && formData.email === '' && formData.phoneNumber === '')
        setFormData({
          name: data.data.name,
          email: data.data.email,
          phoneNumber: data.data.phoneNumber,
          password: '',
          newPassword: '',
        });
    },
  });


  // Handle input change
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle country selection change
  const handleCountryChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const selectedCountryIndex = countryCode.findIndex((option) => option.label === event.target.value);
    countryChange(selectedCountryIndex);
  };

  // Mutation to send form data to server    
  const mutation = useMutation<ResposeType, ErrorType, updateForm>({
    mutationFn: (updateForm) => axios.put(`http://localhost:5000/api/v1/student/${studentId}`, updateForm, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    }),
    onSuccess: (data) => {
      console.log(data);
      setSending(false);
      setShowError(false);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false); // Hide the success message
        navigate('/student'); // Navigate to the next screen
      }, 5000);
    },
    onError: () => {
      console.log(mutation.error);
      setSending(false);
      setShowError(true);
    },
    onMutate: () => {
      console.log(token);
      setSending(true);
      setShowError(false);
    }
  }
  );

  // Function to store JWT token in cookie
  const storeJwtToken = (token: string) => {
    document.cookie = `jwtToken=${token}; expires=${new Date(Date.now() + 60 * 60 * 1000)}; path=/`;
  };

  // Handlde submission
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log(formData);
    // Add country code to phone number
    if (formData.phoneNumber.charAt(0) !== '0')
      formData.phoneNumber = '0' + formData.phoneNumber;

    mutation.mutate(formData);
  };

  return (
    <>
      <ThemeProvider theme={defaultTheme}>
        <Container component="main" maxWidth="xs" >
          <CssBaseline />
          <Box
            sx={{
              marginTop: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Typography component="h1" variant="h5">
              Change Profile Photo
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="photo"
                    type="file"
                    // Image only
                    name="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </Grid>
              </Grid>
                {/* Display current photo */}
                <img
                  src="https://img.freepik.com/premium-photo/happy-young-students-studying-college-library-with-stack-books_21730-4486.jpg"
                  className="my-3"
                />

              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }}>
                <LoadingButton
                  loading={sending}
                  fullWidth
                  type="submit"
                  variant="contained"
                  disabled={showSuccess}
                  sx={{ mt: 2, mb: 2 }}
                >
                  Update Photo
                </LoadingButton>
              </Box>
              {showError && <Alert sx={{ mb: 2 }} severity="error">{mutation.error?.response.data.message}</Alert>}
              {showSuccess && <Alert sx={{ mb: 2 }} severity="success">Update successfully. Back to main page...</Alert>}
              <Grid container justifyContent="flex-end">

              </Grid>
            </Box>
          </Box>
        </Container>
      </ThemeProvider >

    </>
  );
}
