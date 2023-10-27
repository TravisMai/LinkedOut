import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useMutation } from "react-query";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import Alert from '@mui/material/Alert';
import { useEffect, useState } from 'react';
import LoadingButton from '@mui/lab/LoadingButton';
import FormHelperText from '@mui/material/FormHelperText';
import MenuItem from '@mui/material/MenuItem';
import InputAdornment from '@mui/material/InputAdornment';
import { Paper } from '@mui/material';
import Logo from "@/shared/assets/LinkedOut-Logo.svg";

function Copyright(props: any) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" href="https://mui.com/">
                Your Website
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

type ResposeType = {
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

interface newForm {
    name: string;
    email: string;
    phoneNumber: string;
    studentId: string;
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

export default function StudentSignUp() {
    const navigate = useNavigate();
    const [sending, setSending] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);

    const [country, countryChange] = useState(0);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phoneNumber: '',
        studentId: '',
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
    const mutation = useMutation<ResposeType, ErrorType, newForm>({
        mutationFn: (newForm) => axios.post("http://localhost:5000/api/v1/student", newForm),
        onSuccess: (data) => {
            console.log(data);
            setSending(false);
            setShowError(false);
            setShowSuccess(true);
            setTimeout(() => {
                setShowSuccess(false); // Hide the success message
                navigate('/'); // Navigate to the next screen
            }, 5000);
        },
        onError: () => {
            console.log(mutation.error);
            setSending(false);
            setShowError(true);
        },
        onMutate: () => {
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
                <Grid container component="main" sx={{ height: 'auto' }} className='justify-center items-center my-auto absolute top-0 bottom-0 left-0 right- bg-[url(https://hcmut.edu.vn/img/carouselItem/36901269.jpeg?t=36901270)] bg-cover'>
                    <CssBaseline />
                    <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square className='rounded-xl p-10'>
                        <Container component="main" maxWidth="xs" >
                            <CssBaseline />
                            <Box
                                sx={{
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
                                    Request for a student account
                                </Typography>
                                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <TextField
                                                required
                                                fullWidth
                                                id="name"
                                                label="Full Name"
                                                name="name"
                                                autoComplete="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                            />
                                        </Grid>

                                        <Grid item xs={12}>
                                            <TextField
                                                required
                                                fullWidth
                                                id="studentId"
                                                type="text"
                                                label="Student ID"
                                                name="studentId"
                                                autoComplete="studentId"
                                                value={formData.studentId}
                                                onChange={handleInputChange}
                                            />
                                        </Grid>

                                        <Grid item xs={12}>
                                            <TextField
                                                required
                                                fullWidth
                                                id="email"
                                                type="email"
                                                label="School Email"
                                                name="email"
                                                autoComplete="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                            />
                                        </Grid>

                                        <Grid item xs={12}>
                                            <TextField
                                                required
                                                fullWidth
                                                id="phoneNumber"
                                                label="Phone Number"
                                                name="phoneNumber"
                                                autoComplete="phone"
                                                value={formData.phoneNumber}
                                                onChange={handleInputChange}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            {countryCode[country].numberPrefix} {/* Use the selected country's number prefix */}
                                                        </InputAdornment>
                                                    ),
                                                }}
                                                inputProps={{
                                                    pattern: "^[0-9]{9,10}$" // Only allows numeric characters
                                                }}
                                            />
                                        </Grid>
                                    </Grid>

                                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start', marginTop: 2, marginBottom: 2 }}>
                                        <LoadingButton
                                            loading={sending}
                                            fullWidth
                                            type="submit"
                                            variant="contained"
                                            disabled={showSuccess}
                                            sx={{ mt: 2, mb: 2 }}
                                        >
                                            Submit
                                        </LoadingButton>
                                    </Box>
                                    {showError && <Alert sx={{ mb: 2 }} severity="error">{mutation.error?.response.data.message}</Alert>}
                                    {showSuccess && <Alert sx={{ mb: 2 }} severity="success">Create acccount successfully! Navigating back to login page.......</Alert>}
                                    <Grid container justifyContent="flex-end">
                                        <Grid item>
                                            <Link href="/login/student" variant="body2">
                                                Already have an account? Sign in
                                            </Link>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Box>
                        </Container>
                    </Grid>
                </Grid>
            </ThemeProvider>
        </>
    );
}
