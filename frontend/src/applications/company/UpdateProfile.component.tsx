import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useMutation} from "react-query";
import axios from 'axios';
import Alert from '@mui/material/Alert';
import { useEffect, useState } from 'react';
import LoadingButton from '@mui/lab/LoadingButton';
import MenuItem from '@mui/material/MenuItem';
import InputAdornment from '@mui/material/InputAdornment';
import { getJwtToken } from '../../shared/utils/authUtils';

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

type ResponseType = {
  data: {
    id: string;
    name: string;
    email: string;
    phoneNumber: string;
    myfile: string;
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
  taxId: number | null;
  workField: string | null;
  address: string | null;
  website: string | null;
  myfile: File | null;
  description: string | null;
  email: string;
  phoneNumber: string;
  password: string;
  newPassword: string | null;
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

export default function UpdateProfile() {
  const [sending, setSending] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [companyId, setCompanyId] = useState('');

  const [country, countryChange] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    password: '',
    taxId: null as number | null,
    workField: null as string | null,
    address: null as string | null,
    website: null as string | null,
    myfile: null as File | null,
    description: null as string | null,
    newPassword: null as string | null,
  });


  const token = getJwtToken();

  // Fetch current information
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://linkedout-hcmut.feedme.io.vn/api/v1/company/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = response.data;

        // Set student id
        setFormData({
          name: data.name,
          email: data.email,
          // Cut out country code head from phone Number
          phoneNumber: data.phoneNumber.substring(3),
          password: '',
          taxId: data.taxId,
          workField: data.workField,
          address: data.address,
          website: data.website,
          myfile: null,
          description: data.description,
          newPassword: null,
        });
        setCompanyId(data.id);

        
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  });

  // Handle input change
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle upload file
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFormData((prevData) => ({
        ...prevData,
        myfile: file,
      }));
    }
  };

  // Handle country selection change
  const handleCountryChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const selectedCountryIndex = countryCode.findIndex((option) => option.label === event.target.value);
    countryChange(selectedCountryIndex);
  };

  // Mutation to send form data to server    
  const mutation = useMutation<ResponseType, ErrorType, updateForm>({
    mutationFn: () => {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null) {
          if (key === 'myfile') {
            formDataToSend.append(key, value as File); // Append file to FormData
          } else if (key === 'phoneNumber') {
            if (formData.phoneNumber.charAt(0) !== '+') {
              if (formData.phoneNumber.length === 10 && formData.phoneNumber.charAt(0) === '0') {
                // Remove 0 and add country code
                formData.phoneNumber = countryCode[country].numberPrefix + formData.phoneNumber.substring(1);
              }
              formData.phoneNumber = countryCode[country].numberPrefix + formData.phoneNumber;
              formDataToSend.append(key, formData.phoneNumber.toString());
            }
          }
          else {
            formDataToSend.append(key, value.toString()); // Convert other fields to string
          }

        }
      });
      return axios.put(`https://linkedout-hcmut.feedme.io.vn/api/v1/company/${companyId}`, formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        }
      });
    },
    onSuccess: () => {
      setSending(false);
      setShowError(false);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false); // Hide the success message
        window.location.reload();
      }, 2000);
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
  // const storeJwtToken = (token: string) => {
  //   document.cookie = `jwtToken=${token}; expires=${new Date(Date.now() + 60 * 60 * 1000)}; path=/`;
  // };

  // Handlde submission
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Add country code to phone number

    mutation.mutate(formData);
  };



  return (
    <>
      <ThemeProvider theme={defaultTheme}>
        <Container component="main" maxWidth="lg" >
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              marginBottom: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '70%',
              marginX: 'auto',
            }}
          >
            <Typography component="h1" variant="h5">
              UPDATE INFORMATION
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
                <Grid item xs={12} sm={4}>
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
                <Grid item xs={12} sm={8}>
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
                    autoComplete="password"
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    name="newPassword"
                    label="New Password"
                    type="password"
                    id="newPassword"
                    autoComplete="new-password"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12}>
                <TextField
                    required
                    fullWidth
                    id="address"
                    label="Address"
                    name="address"
                    autoComplete="address"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    value={formData.address}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="workField"
                    type="text"
                    label="Work Field"
                    name="workField"
                    autoComplete="workField"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    value={formData.workField}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="description"
                    type="text"
                    label="Description"
                    name="description"
                    autoComplete="description"
                    multiline
                    rows={4}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    value={formData.description}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="taxId"
                    type="number"
                    label="Tax ID"
                    name="taxId"
                    autoComplete="taxId"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    value={formData.taxId}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="website"
                    type="text"
                    label="Website"
                    name="website"
                    autoComplete="website"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    value={formData.website}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="myfile"
                    type="file"
                    label="Logo"
                    name='myfile'
                    InputLabelProps={{
                      shrink: true,
                    }}
                    onChange={handleFileChange} // Handle file input change
                  />
                </Grid>
              </Grid>

              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }}>
                <LoadingButton
                  loading={sending}
                  fullWidth
                  type="submit"
                  variant="contained"
                  disabled={showSuccess}
                  sx={{ mt: 2, mb: 2 }}
                >
                  Update
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
