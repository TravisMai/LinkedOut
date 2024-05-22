import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useMutation, useQuery } from "react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Alert from "@mui/material/Alert";
import { useState } from "react";
import LoadingButton from "@mui/lab/LoadingButton";
import MenuItem from "@mui/material/MenuItem";
import InputAdornment from "@mui/material/InputAdornment";
import { getJwtToken } from "../../../shared/utils/authUtils";

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

type ResponseType = {
  data: {
    id: string;
    name: string;
    email: string;
    phoneNumber: string;
    avatar: string;
    isGoogle: boolean;
    isVerify: boolean;
  };
};

type ErrorType = {
  response: {
    data: {
      message: string;
    };
  };
};

interface updateForm {
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
  newPassword: string;
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

export default function CompanyProfile() {
  const navigate = useNavigate();
  const [sending, setSending] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [companyId, setCompanyId] = useState("");

  const [country, countryChange] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    newPassword: "",
    phoneNumber: "",
  });

  const token = getJwtToken();

  // Fetch current information
  useQuery({
    queryKey: "currentInfo",
    queryFn: () =>
      axios.get("https://linkedout-hcmut.feedme.io.vn/api/v1/company/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    onSuccess: (data) => {
      // Set company id
      setCompanyId(data.data.id);

      // Set form data
      if (
        formData.name === "" &&
        formData.email === "" &&
        formData.phoneNumber === ""
      )
        setFormData({
          name: data.data.name,
          email: data.data.email,
          phoneNumber: data.data.phoneNumber,
          password: "",
          newPassword: "",
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
  const handleCountryChange = (
    event: React.ChangeEvent<{ value: unknown }>,
  ) => {
    const selectedCountryIndex = countryCode.findIndex(
      (option) => option.label === event.target.value,
    );
    countryChange(selectedCountryIndex);
  };

  // Mutation to send form data to server
  const mutation = useMutation<ResponseType, ErrorType, updateForm>({
    mutationFn: (updateForm) =>
      axios.put(
        `https://linkedout-hcmut.feedme.io.vn/api/v1/company/${companyId}`,
        updateForm,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      ),
    onSuccess: () => {
      setSending(false);
      setShowError(false);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false); // Hide the success message
        navigate("/company"); // Navigate to the next screen
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
    // Add country code to phone number
    if (formData.phoneNumber.charAt(0) == "0")
      // Remove first character if it is 0
      formData.phoneNumber = formData.phoneNumber.substring(
        1,
        formData.phoneNumber.length,
      );

    formData.phoneNumber = "+84" + formData.phoneNumber;

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
                    required
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
                  Update
                </LoadingButton>
              </Box>
              {showError && (
                <Alert sx={{ mb: 2 }} severity="error">
                  {mutation.error?.response.data.message}
                </Alert>
              )}
              {showSuccess && (
                <Alert sx={{ mb: 2 }} severity="success">
                  Update successfully. Back to main page...
                </Alert>
              )}
              <Grid container justifyContent="flex-end"></Grid>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    </>
  );
}
