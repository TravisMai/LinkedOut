import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
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
import CompanyAppBar from "../CompanyAppBar.component";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
} from "@mui/material";
import { getJwtToken } from "../../../shared/utils/authUtils";
import dayjs from "dayjs";

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

interface createForm {
  title: string;
  level: string;
  workType: string;
  // image: File,
  quantity: number;
  descriptions: postDescriptionType;
  openDate: Date;
  expireDate: Date;
  salary: number;
  // isActive: boolean,
  internshipPrograme: File;
}

export default function AddJob() {
  const navigate = useNavigate();
  const [sending, setSending] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  const [formData, setFormData] = useState<createForm>({
    title: "",
    level: "",
    workType: "",
    quantity: 0,
    // image: new File([""], "filename"),
    descriptions: {
      aboutUs: "",
      responsibilities: [""],
      requirements: [""],
      preferredQualifications: [""],
      benefits: [""],
    },
    openDate: new Date(),
    // expireDate is 7 days latter
    expireDate: dayjs().add(7, "day").toDate(),
    salary: 0,
    // isActive: false,
    internshipPrograme: new File([""], "filename"),
  });

  // Get jwt token
  const token = getJwtToken();

  // Handle input change
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const descriptionFields = [
      "responsibilities",
      "requirements",
      "preferredQualifications",
      "benefits",
    ];
    // If the name is responsibilities or requirements, handle them as arrays
    if (descriptionFields.includes(name)) {
      setFormData((prevData) => ({
        ...prevData,
        descriptions: {
          ...prevData.descriptions,
          [name]: value.split(",").map((item) => item.trim()), // Assuming responsibilities and requirements are comma-separated lists
        },
      }));
    } else if (name === "aboutUs") {
      setFormData((prevData) => ({
        ...prevData,
        descriptions: {
          ...prevData.descriptions,
          [name]: value, // Assuming responsibilities and requirements are comma-separated lists
        },
      }));
    } else {
      // For other fields, handle as usual

      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  // Handle upload file
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFormData((prevData) => ({
        ...prevData,
        internshipPrograme: file,
      }));
    }
  };

  // Handle checkbox change
  const [isInternship, setIsInternship] = useState(false);
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsInternship(event.target.checked);
    setFormData((prevData) => ({
      ...prevData,
      workType: event.target.checked ? "Internship" : "",
    }));
  };

  // Handle date picker change for open date
  const handleOpenDateChange = (date: Date | null) => {
    if (date) {
      setFormData((prevData) => ({
        ...prevData,
        openDate: date,
      }));
    }
  };

  // Handle date picker change for expire date
  const handleExpireDateChange = (date: Date | null) => {
    if (date) {
      setFormData((prevData) => ({
        ...prevData,
        expireDate: date,
      }));
    }
  };

  // Mutation to send form data to server
  const mutation = useMutation<ResponseType, ErrorType, createForm>({
    // mutationFn: (formData) => axios.post(`https://linkedout-hcmut.feedme.io.vn/api/v1/job`, formData, {
    //     headers: {
    //         Authorization: `Bearer ${token}`,
    //     }
    // }),

    mutationFn: (formData) => {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null) {
          if (key === "internshipPrograme" || key === "images") {
            formDataToSend.append(key, value as File); // Append file to FormData
          } else if (key === "descriptions") {
            // Convert description into string
            formDataToSend.append(key, JSON.stringify(value));
            console.log("String: ", formData[key]);
          } else if (key === "openDate" || key === "expireDate") {
            // Stringify date
            formDataToSend.append(key, value.toISOString());
          } else {
            formDataToSend.append(key, value.toString()); // Convert other fields to string
          }
        }
      });
      return axios.post(
        "https://linkedout-hcmut.feedme.io.vn/api/v1/job",
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
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
        navigate("/company/jobs"); // Navigate to the next screen
      }, 2000);
    },
    onError: () => {
      console.log(mutation.error);
      setSending(false);
      setShowError(true);
    },
    onMutate: () => {
      console.log("Sending", formData);
      setSending(true);
      setShowError(false);
    },
  });

  // Handlde submission
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <>
      <CompanyAppBar />
      <ThemeProvider theme={defaultTheme}>
        <Container component="main" maxWidth="lg">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              marginBottom: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "70%",
              marginX: "auto",
            }}
          >
            <Typography component="h1" variant="h5">
              CREATE A NEW JOB
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    label="Job Title"
                    name="title"
                    autoComplete="title"
                    value={formData.title}
                    onChange={handleInputChange}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="level"
                    label="Level"
                    type="text"
                    autoComplete="level"
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  {/* Check box for worktype, is Internship or not */}
                  <FormControl fullWidth>
                    <Grid container columnSpacing={6}>
                      <Grid item xs={8}>
                        <TextField
                          required
                          fullWidth
                          name="workType"
                          label="Work Type"
                          type="text"
                          autoComplete="workType"
                          onChange={handleInputChange}
                          value={formData.workType}
                          disabled={isInternship}
                        />
                      </Grid>
                      <Grid item xs={4}>
                        <FormGroup>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={isInternship}
                                onChange={handleCheckboxChange}
                              />
                            }
                            label="Internship"
                          />
                        </FormGroup>
                      </Grid>
                    </Grid>
                  </FormControl>
                </Grid>
                {isInternship && (
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      name="internshipPrograme"
                      label="Internship Program"
                      type="file"
                      autoComplete="internshipPrograme"
                      onChange={handleFileChange}
                    />
                  </Grid>
                )}

                <Grid item xs={12}>
                  <Box display={"flex"} flexDirection={"row"} gap={5}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="Open Date"
                        value={dayjs(formData.openDate)}
                        onChange={(newValue) =>
                          handleOpenDateChange(newValue?.toDate() ?? null)
                        }
                        format="DD/MM/YYYY"
                      />
                    </LocalizationProvider>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="Expired Date"
                        value={dayjs(formData.expireDate)}
                        onChange={(newValue) =>
                          handleExpireDateChange(newValue?.toDate() ?? null)
                        }
                        format="DD/MM/YYYY"
                      />
                    </LocalizationProvider>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    name="aboutUs"
                    label="Description"
                    type="text"
                    autoComplete="aboutUs"
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    name="quantity"
                    label="Quantity"
                    type="number"
                    autoComplete="quantity"
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  {/* Display salary with 3 digits separator, and a $ sign */}
                  <TextField
                    fullWidth
                    name="salary"
                    label="Salary"
                    type="number"
                    autoComplete="salary"
                    onChange={handleInputChange}
                  />
                  {/* <TextField
                                        fullWidth
                                        name="salary"
                                        label="Salary"
                                        type="number"
                                        autoComplete="salary"
                                        onChange={handleInputChange}
                                    /> */}
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    name="responsibilities"
                    label="Responsibilities"
                    type="text"
                    autoComplete="responsibilities"
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    name="requirements"
                    label="Requirements"
                    type="text"
                    autoComplete="requirements"
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    name="benefits"
                    label="Benefits"
                    type="text"
                    autoComplete="benefits"
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    name="preferredQualifications"
                    label="Preferred Qualifications"
                    type="text"
                    autoComplete="preferredQualifications"
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
                  Create
                </LoadingButton>
              </Box>
              {showError && (
                <Alert sx={{ mb: 2 }} severity="error">
                  {mutation.error?.response.data.message}
                </Alert>
              )}
              {showSuccess && (
                <Alert sx={{ mb: 2 }} severity="success">
                  Job created successfully
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
