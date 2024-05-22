import * as React from "react";
import Avatar from "@mui/material/Avatar";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useMutation } from "react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Alert from "@mui/material/Alert";
import { useState } from "react";
import LoadingButton from "@mui/lab/LoadingButton";
import MenuItem from "@mui/material/MenuItem";
import InputAdornment from "@mui/material/InputAdornment";

function Copyright(props: any) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

type ResponseType = {
  data: {
    student: {
      id: string;
      name: string;
      email: string;
      phoneNumber: string;
      // avatar: string;
      isGoogle: boolean;
      isVerify: boolean;
    };
    token: string;
  };
};

type ErrorType = {
  response: {
    data: {
      message: string;
    };
  };
};

interface newForm {
  name: string;
  taxId: number | null;
  workField: string | null;
  address: string | null;
  website: string | null;
  // avatar: File | null;
  description: string | null;
  email: string;
  phoneNumber: string;
  password: string;
}

const countryCode = [
  {
    label: "VNM",
    numberPrefix: "+84",
  },
  {
    label: "AUS",
    numberPrefix: "+61",
  },
  {
    label: "USA",
    numberPrefix: "+1",
  },
  {
    label: "JPN",
    numberPrefix: "+81",
  },
];

export default function CompanySignUp() {
  const navigate = useNavigate();
  const [sending, setSending] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  const [country, countryChange] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
    taxId: null as number | null,
    workField: null as string | null,
    address: null as string | null,
    website: null as string | null,
    // avatar: null as File | null,
    description: null as string | null,
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
  const handleCountryChange = (
    event: React.ChangeEvent<{ value: unknown }>,
  ) => {
    const selectedCountryIndex = countryCode.findIndex(
      (option) => option.label === event.target.value,
    );
    countryChange(selectedCountryIndex);
  };

  // Mutation to send form data to server
  const mutation = useMutation<ResponseType, ErrorType, newForm>({
    mutationFn: (formData) => {
      return axios.post(
        "https://linkedout-hcmut.feedme.io.vn/api/v1/company",
        formData,
      );
    },
    onSuccess: (data) => {
      console.log(data);
      setSending(false);
      setShowError(false);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false); // Hide the success message
        navigate("/"); // Navigate to the next screen
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
    },
  });

  // Handlde submission
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log(formData);
    // Add country code to phone number
    if (formData.phoneNumber.charAt(0) !== "0")
      formData.phoneNumber = "0" + formData.phoneNumber;

    // Convert taxId to number
    formData.taxId = Number(formData.taxId); //HERE

    mutation.mutate(formData);
  };

  return (
    <>
      <ThemeProvider theme={defaultTheme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign up company account
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="name"
                    label="Company Name"
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
                          {countryCode[country].numberPrefix}{" "}
                          {/* Use the selected country's number prefix */}
                        </InputAdornment>
                      ),
                    }}
                    inputProps={{
                      pattern: "^[0-9]{9,10}$", // Only allows numeric characters
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="address"
                    type="text"
                    label="Address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="workField"
                    type="text"
                    label="Work Field"
                    name="workField"
                    value={formData.workField}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="description"
                    type="text"
                    label="Description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="tax"
                    type="number"
                    name="taxId"
                    label="Tax ID"
                    value={formData.taxId}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="website"
                    type="url"
                    label="Website"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                  />
                </Grid>
                {/* <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        id="avatar"
                                        type="file"
                                        label="Avatar"
                                        name='avatar'
                                        value={formData.avatar}
                                        onChange={handleInputChange}
                                        inputProps={{ accept: 'image/png' }}
                                    />
                                </Grid> */}
              </Grid>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "start",
                }}
              >
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
              {showError && (
                <Alert sx={{ mb: 2 }} severity="error">
                  {mutation.error?.response.data.message}
                </Alert>
              )}
              {showSuccess && (
                <Alert sx={{ mb: 2 }} severity="success">
                  Create acccount successfully! Navigating back to login
                  page.......
                </Alert>
              )}
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
      </ThemeProvider>
    </>
  );
}
