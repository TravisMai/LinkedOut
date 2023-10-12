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
import { useState } from 'react';
import LoadingButton from '@mui/lab/LoadingButton';
import FormHelperText from '@mui/material/FormHelperText';
import MenuItem from '@mui/material/MenuItem';
import InputAdornment from '@mui/material/InputAdornment';

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

interface newForm {
    name: string;
    email: string;
    phoneNumber: string;
    password: string;
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

export default function SignUp() {
    const navigate = useNavigate();
    const [sending, setSending] = useState(false);

    const [country, countryChange] = useState(0);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phoneNumber: '',
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

    // Function to store JWT token in cookie
    const storeJwtToken = (token: string) => {
        document.cookie = `jwtToken=${token}; expires=${new Date(Date.now() + 60 * 60 * 1000)}; path=/`;
    };

    // Handle country selection change
    const handleCountryChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        const selectedCountryIndex = countryCode.findIndex((option) => option.label === event.target.value);
        countryChange(selectedCountryIndex);
    };

    // Mutation to send form data to server    
    const mutation = useMutation<ResponeType, Error, newForm>(
        (newForm) => axios.post("http://localhost:5000/api/v1/student", newForm)
    );

    // Handlde submission
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        // Add country code to phone number
        formData.phoneNumber = '0' + formData.phoneNumber;
        
        mutation.mutate(formData);
    };
    if (mutation.isLoading) {
        return <span>Submitting...</span>;
    }
    if (mutation.isError) {
        console.log(mutation.error);
        return <span>Error: {mutation.error?.message}</span>;
    }

    if (mutation.isSuccess) {
        const token = mutation.data?.data.token;

        // Store token in cookie
        storeJwtToken(token);
        navigate('/student/');
        return <div>Yeah</div>
    }

    return (
        <ThemeProvider theme={defaultTheme}>
            <Container component="main" maxWidth="xs" >
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign up
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
                                    id="email"
                                    type="email"
                                    label="Email Address"
                                    name="email"
                                    autoComplete="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <TextField
                                    id="selectCountry"
                                    select
                                    label="Country"
                                    defaultValue={countryCode[country].label}
                                    fullWidth
                                    value={countryCode[country].label} // Use the selected country from state
                                    onChange={handleCountryChange} // Handle country selection change

                                >
                                    {countryCode.map((option) => (
                                        <MenuItem key={option.label} value={option.label}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xs={12} sm={9}>
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

                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type="password"
                                    id="password"
                                    autoComplete="new-password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                />
                            </Grid>
                        </Grid>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }}>
                            {/* <Typography className='text-red-500' variant="body2" mt={2} mb={-2}>
                                {isButtonDisabled && "*Please fill in all fields."}
                            </Typography> */}
                            <LoadingButton
                                loading={sending}
                                fullWidth
                                type="submit"
                                variant="contained"
                                sx={{ mt: 2, mb: 2 }}
                            >
                                Submit
                            </LoadingButton>
                        </Box>
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <Link href="#" variant="body2">
                                    Already have an account? Sign in
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
                <Copyright sx={{ mt: 5 }} />
            </Container>
        </ThemeProvider >
    );
}
