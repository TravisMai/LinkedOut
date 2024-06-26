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
import Alert from "@mui/material/Alert";
import { useState } from "react";
import LoadingButton from "@mui/lab/LoadingButton";
import { getJwtToken } from "../../../../shared/utils/authUtils";

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

type ResponseType = {
  data: {
    objective: string;
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
  objective: string;
}

export default function UpdateObjective({ onClose }: { onClose: () => void }) {
  const handleClose = () => {
    onClose();
  };

  const [sending, setSending] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [studentId, setStudentId] = useState("");

  const [formData, setFormData] = useState({
    objective: "",
  });

  // Get jwt token
  const token = getJwtToken();

  // Fetch current information
  useQuery({
    queryKey: "studentInfo",
    queryFn: () =>
      axios.get(
        `https://linkedout-hcmut.feedme.io.vn/api/v1/student/me`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      ),
    onSuccess: (data) => {
      setStudentId(data.data?.id);
      const updatedFormData = {
        objective: data.data?.objective ?? "",
      };
      setFormData(updatedFormData);
    },
    onError: (error) => {
      console.error("Error fetching data", error);
    }
  });

  // Mutation to send form data to server
  const mutation = useMutation<ResponseType, ErrorType, updateForm>({
    mutationFn: (formData) => {
      return axios.put(
        `https://linkedout-hcmut.feedme.io.vn/api/v1/student/${studentId}`,
        formData,
        {
          headers: {
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
              Update Objective
            </Typography>

            <Box component="form" onSubmit={handleSubmit} sx={{ my: 2 }}>
              <TextField
                fullWidth
                id="objective"
                type="string"
                name="objective"
                autoComplete="objective"
                value={formData.objective}
                onChange={handleInputChange}
                multiline
                rows={4}
                style={{ width: "500px" }}
              />

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
