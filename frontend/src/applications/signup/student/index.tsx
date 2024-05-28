import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useMutation } from "react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Alert from "@mui/material/Alert";
import { useState } from "react";
import LoadingButton from "@mui/lab/LoadingButton";
import InputAdornment from "@mui/material/InputAdornment";
import {
  Accordion,
  AccordionSummary,
  Paper,
  AccordionDetails,
} from "@mui/material";
import Logo from "@/shared/assets/LinkedOut-Logo.svg";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

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
  email: string;
  phoneNumber: string;
  studentId: number;
  classCode: string;
  // faculty: string;
  major: string;
  year: number;
  myfile: File | null;
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

export default function StudentSignUp() {
  const navigate = useNavigate();
  const [sending, setSending] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  const [country] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    studentId: 0,
    classCode: "",
    // faculty: '',
    major: "",
    year: 0,
    myfile: null as File | null,
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
  // const handleCountryChange = (event: React.ChangeEvent<{ value: unknown }>) => {
  //     const selectedCountryIndex = countryCode.findIndex((option) => option.label === event.target.value);
  //     countryChange(selectedCountryIndex);
  // };

  // Mutation to send form data to server
  const mutation = useMutation<ResponseType, ErrorType, newForm>({
    mutationFn: (formData) => {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null) {
          if (key === "myfile") {
            formDataToSend.append(key, value as File); // Append file to FormData
          } else if (key === "studentId") {
            // const blobValue = new Blob([new Uint8Array([value])]);
            formDataToSend.append(key, value);
          } else {
            formDataToSend.append(key, value.toString()); // Convert other fields to string
          }
        }
      });
      return axios.post(
        "https://linkedout-hcmut.feedme.io.vn/api/v1/student",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Set content type for file upload
          },
        },
      );
    },
    onSuccess: () => {
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

    // Add country code to phone number
    if (formData.phoneNumber.charAt(0) !== "0")
      formData.phoneNumber = "0" + formData.phoneNumber;

    // Change studentId to number
    formData.studentId = Number(formData.studentId);
    mutation.mutate(formData);
  };

  return (
    <>
      <ThemeProvider theme={defaultTheme}>
        <Grid
          container
          component="main"
          className="justify-center items-center h-full my-auto min-h-screen bg-[url(https://hcmut.edu.vn/img/carouselItem/36901269.jpeg?t=36901270)] bg-cover"
        >
          <CssBaseline />
          <Grid
            item
            xs={12}
            sm={8}
            md={5}
            component={Paper}
            elevation={6}
            square
            className="rounded-xl p-10"
          >
            <Container component="main" maxWidth="xs">
              <CssBaseline />
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <img src={Logo} className="w-1/5 h-1/5 rounded-full mb-4" />
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
                        type="number"
                        label="Student ID"
                        name="studentId"
                        autoComplete="studentId"
                        value={
                          formData.studentId == 0 ? "" : formData.studentId
                        }
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
                    {/* <Grid item xs={12}>
                                            <TextField
                                                required
                                                fullWidth
                                                id="faculty"
                                                label="Faculty"
                                                name="faculty"
                                                autoComplete="faculty"
                                                value={formData.faculty}
                                                onChange={handleInputChange}
                                            />
                                        </Grid> */}
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        id="major"
                        label="Major"
                        name="major"
                        autoComplete="major"
                        value={formData.major}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        id="year"
                        type="number"
                        label="Year"
                        name="year"
                        autoComplete="year"
                        value={formData.year == 0 ? "" : formData.year}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        id="classCode"
                        label="Class Code"
                        name="classCode"
                        autoComplete="classCode"
                        value={formData.classCode}
                        onChange={handleInputChange}
                      />
                    </Grid>
                  </Grid>

                  <Accordion className="mt-3">
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel2-content"
                      id="panel2-header"
                    >
                      More Information
                    </AccordionSummary>
                    <AccordionDetails>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            id="myfile"
                            type="file"
                            label="Avatar"
                            InputLabelProps={{
                              shrink: true,
                            }}
                            name="myfile"
                            onChange={handleFileChange}
                          />
                        </Grid>
                      </Grid>
                    </AccordionDetails>
                  </Accordion>

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "start",
                      marginTop: 2,
                      marginBottom: 2,
                    }}
                  >
                    <LoadingButton
                      loading={sending}
                      fullWidth
                      type="submit"
                      variant="contained"
                      disabled={showSuccess}
                      sx={{ mt: 2, mb: 1 }}
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
                      <Link href="/login/student" variant="body2">
                        Already have an account? Sign in
                      </Link>
                    </Grid>
                  </Grid>
                  <Grid container justifyContent="flex-end">
                    <Grid item>
                      <Link href="/" variant="body2">
                        Return to home page
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
