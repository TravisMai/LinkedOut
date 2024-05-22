import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useMutation, useQuery } from "react-query";
import axios from "axios";
import Alert from "@mui/material/Alert";
import { useState } from "react";
import LoadingButton from "@mui/lab/LoadingButton";
import { getJwtToken } from "../../../../shared/utils/authUtils";
import { AttachFile, Delete } from "@mui/icons-material";

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

type ResponseType = {
  data: {
    resume: resumeType[] | null;
    id: string;
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
  resume: File | null;
  deleteResumeID: string[] | null;
  resumeObjective: string | null;
}

export default function UpdateResume({ onClose }: { onClose: () => void }) {
  const handleClose = () => {
    onClose();
  };

  const [sending, setSending] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [studentId, setStudentId] = useState("");
  const [currentResume, setCurrentResume] = useState<resumeType[]>([]); // State to store current resume
  const [showAddNew, setShowAddNew] = useState(false); // State to show/hide add new working history button

  const [formData, setFormData] = useState<{
    resume: File | null;
    deleteResumeID: string[] | null;
    resumeObjective: string | null;
  }>({
    resume: null,
    deleteResumeID: null,
    resumeObjective: null,
  });

  // Get jwt token
  const token = getJwtToken();

  // Fetch current information
  useQuery({
    queryKey: "studentInfo2",
    queryFn: () =>
      axios.get("https://linkedout-hcmut.feedme.io.vn/api/v1/student/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    onSuccess: (data) => {
      // Set student id
      setStudentId(data.data.id);
      // Set current resume
      setCurrentResume(data.data.resume);
    },
  });

  // Mutation to send form data to server
  const mutation = useMutation<ResponseType, ErrorType, updateForm>({
    mutationFn: (formData) => {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null) {
          if (key === "myfile") {
            formDataToSend.append(key, value as File); // Append file to FormData
          }
        }
      });
      return axios.put(
        `https://linkedout-hcmut.feedme.io.vn/api/v1/student/${studentId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Set content type for file upload
            Authorization: `Bearer ${token}`,
          },
        },
      );
    },
    onSuccess: () => {
      setSending(false);
      setShowError(false);
      setShowSuccess(true);
      handleClose();
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
    mutation.mutate(formData);
  };

  // Handle file input change
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; // Get the first file from the input
    setFormData((prevData: any) => ({
      ...prevData,
      resume: file, // Update the myfile field with the selected file
    }));
  };

  // Handle input change
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <>
      <ThemeProvider theme={defaultTheme}>
        <Container component="main" style={{ width: "600px" }}>
          <CssBaseline />
          <Box
            sx={{
              marginTop: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography component="h1" variant="h5">
              Update Résumé
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{ mx: 2, mt: 5, mb: 2 }}
            >
              <Grid
                container
                spacing={2}
                rowSpacing={3}
                justifyContent="center"
              >
                {currentResume?.map((item: resumeType, index) => (
                  <>
                    <Grid
                      item
                      container
                      columnSpacing={3}
                      alignItems={"center"}
                      justifyContent={"between"}
                      className="pl-5"
                    >
                      <Grid item xs={1}>
                        <AttachFile />
                      </Grid>
                      <Grid item xs={9} sx={{ minWidth: "250px" }}>
                        <Link href={item.url} target="_blank" rel="noreferrer">
                          <Typography variant="h6">{item.title}</Typography>
                        </Link>
                      </Grid>
                      <Grid item xs={1} sx={{ justifyItems: "right" }}>
                        {/* Delete current field */}
                        <LoadingButton
                          loading={sending}
                          variant="outlined"
                          color="error"
                          onClick={() => {
                            const updatedFormData = { ...formData };
                            // Add new field to delete list
                            if (updatedFormData?.deleteResumeID === null) {
                              updatedFormData.deleteResumeID = [item.id];
                            } else {
                              updatedFormData.deleteResumeID.push(item.id);
                            }
                            setFormData(updatedFormData);
                            // Also delete the field from current resume
                            currentResume.splice(index, 1);
                          }}
                        >
                          <Delete />
                        </LoadingButton>
                      </Grid>
                    </Grid>
                  </>
                )) ?? ""}
              </Grid>
              {/* Add new workingHistory */}
              {!showAddNew && (
                <Grid container justifyContent="center">
                  <LoadingButton
                    loading={sending}
                    color="success"
                    variant="contained"
                    onClick={() => {
                      setShowAddNew(true);
                    }}
                    sx={{ mt: 2, mb: 2 }}
                  >
                    Upload new file
                  </LoadingButton>
                </Grid>
              )}
              {showAddNew && (
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                  <Grid container spacing={2}>
                    <Grid item>
                      <TextField
                        fullWidth
                        id="title"
                        type="text"
                        label="Title"
                        placeholder="Enter your resume name"
                        variant="standard"
                        // Image only
                        name="resumeObjective"
                        autoComplete="title"
                        onChange={handleInputChange}
                        style={{ width: "500px" }}
                      />
                    </Grid>
                    <Grid item xs={12} spacing={2}>
                      <TextField
                        required
                        fullWidth
                        id="resume"
                        type="file"
                        // Image only
                        name="resume"
                        autoComplete="resume"
                        onChange={handleFileChange}
                        style={{ width: "500px" }}
                      />
                    </Grid>
                  </Grid>
                </Box>
              )}
              {/* Display current photo */}

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
                  sx={{ mt: 2, mb: 2, width: "50vh" }}
                >
                  Update
                </LoadingButton>
              </Box>
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
          </Box>
        </Container>
      </ThemeProvider>
    </>
  );
}
