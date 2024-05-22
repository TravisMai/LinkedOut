import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useMutation } from "react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Alert from "@mui/material/Alert";
import { useState } from "react";
import LoadingButton from "@mui/lab/LoadingButton";
import MenuItem from "@mui/material/MenuItem";
import InputAdornment from "@mui/material/InputAdornment";
import Logo from "@/shared/assets/LinkedOut-Logo.svg";
import { Paper } from "@mui/material";

// function Copyright(props: any) {
//     return (
//         <Typography variant="body2" color="text.secondary" align="center" {...props}>
//             {'Copyright © '}
//             <Link color="inherit" href="https://mui.com/">
//                 Your Website
//             </Link>{' '}
//             {new Date().getFullYear()}
//             {'.'}
//         </Typography>
//     );
// }

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

type ResponseType = {
  data: {
    student: {
      id: string;
      name: string;
      email: string;
      phoneNumber: string;
      myfile: string;
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
  taxId: string | "";
  workField: string | "";
  address: string | "";
  website: string | "";
  myfile: File;
  description: string | "";
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
    taxId: "",
    workField: "",
    address: "",
    website: "",
    myfile: new File([], ""),
    description: "",
  });

  // Handle input change
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle file input change
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; // Get the first file from the input
    setFormData((prevData: any) => ({
      ...prevData,
      myfile: file, // Update the myfile field with the selected file
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
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== "") {
          if (key === "myfile") {
            formDataToSend.append(key, value as File); // Append file to FormData
          } else {
            formDataToSend.append(key, value.toString()); // Convert other fields to string
          }
        }
      });
      return axios.post(
        "https://linkedout-hcmut.feedme.io.vn/api/v1/company",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Set content type for file upload
          },
        },
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
    // console.log(formData);
    // Add country code to phone number
    if (formData.phoneNumber.charAt(0) !== "0")
      formData.phoneNumber = "0" + formData.phoneNumber;

    console.log(formData);
    mutation.mutate(formData);
  };

  return (
    <>
      <ThemeProvider theme={defaultTheme}>
        <Grid container component="main" sx={{ height: "100vh" }}>
          <CssBaseline />
          <Grid
            item
            xs={false}
            sm={4}
            md={7}
            sx={{
              backgroundImage:
                "url(https://www.singhalonline.com/assets/images/photos/header-2.jpg)",
              backgroundRepeat: "no-repeat",
              backgroundColor: (t) =>
                t.palette.mode === "light"
                  ? t.palette.grey[50]
                  : t.palette.grey[900],
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <Grid
            item
            xs={12}
            sm={8}
            md={5}
            component={Paper}
            elevation={6}
            square
          >
            <Box
              sx={{
                my: 8,
                mx: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <img src={Logo} className="w-1/5 h-1/5 rounded-full mb-4" />
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
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      id="myfile"
                      type="file"
                      label="Logo"
                      name="myfile"
                      onChange={handleFileChange} // Handle file input change
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
                    Submit
                  </LoadingButton>
                </Box>
                {showError && (
                  <Alert sx={{ mb: 2 }} severity="error">
                    {mutation.error?.response?.data?.message}
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
                    <Link href="/login/company" variant="body2">
                      Already have an account? Log in
                    </Link>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </ThemeProvider>
    </>
  );
}
