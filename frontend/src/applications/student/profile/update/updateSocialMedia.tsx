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
import {
  Facebook,
  GitHub,
  Google,
  LinkedIn,
  Twitter,
} from "@mui/icons-material";

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

type ResponseType = {
  data: {
    socialMedia: {
      github: string;
      linkedin: string;
      google: string;
      facebook: string;
      twitter: string;
    };
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
  socialMedia: {
    github: string;
    linkedin: string;
    google: string;
    facebook: string;
    twitter: string;
  };
}

export default function UpdateSocialMedia({
  onClose,
}: {
  onClose: () => void;
}) {
  const handleClose = () => {
    onClose();
  };

  const [sending, setSending] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [studentId, setStudentId] = useState("");

  const [formData, setFormData] = useState({
    socialMedia: {
      github: "",
      linkedin: "",
      google: "",
      facebook: "",
      twitter: "",
    },
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
        ...formData,
        socialMedia: {
          github: data.data?.socialMedia?.github ?? "",
          linkedin: data.data?.socialMedia?.linkedin ?? "",
          google: data.data?.socialMedia?.google ?? "",
          facebook: data.data?.socialMedia?.facebook ?? "",
          twitter: data.data?.socialMedia?.twitter ?? "",
        },
      };
      setFormData(updatedFormData);
    },
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
      // console.log(mutation.error);
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
      socialMedia: {
        ...prevData.socialMedia,
        [name]: value,
      },
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
              Update Social Media Links
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ mx: 2, my: 2 }}>
              <Grid container spacing={2} justifyContent="center">
                <Grid container direction="row" className="mt-3 mx-5">
                  <Grid item xs={1} className="pt-2">
                    <GitHub />
                  </Grid>
                  <Grid item xs={11}>
                    <TextField
                      fullWidth
                      id="github"
                      type="string"
                      name="github"
                      autoComplete="github"
                      label="GitHub"
                      value={formData?.socialMedia?.github}
                      onChange={handleInputChange}
                    />
                  </Grid>
                </Grid>
                <Grid container direction="row" className="mt-3 mx-5">
                  <Grid item xs={1} className="pt-2">
                    <LinkedIn />
                  </Grid>
                  <Grid item xs={11}>
                    <TextField
                      fullWidth
                      id="linkedin"
                      type="string"
                      name="linkedin"
                      autoComplete="linkedin"
                      label="LinkedIn"
                      value={formData?.socialMedia?.linkedin}
                      onChange={handleInputChange}
                    />
                  </Grid>
                </Grid>
                <Grid container direction="row" className="mt-3 mx-5">
                  <Grid item xs={1} className="pt-2">
                    <Google />
                  </Grid>
                  <Grid item xs={11}>
                    <TextField
                      fullWidth
                      id="google"
                      type="string"
                      name="google"
                      autoComplete="google"
                      label="Google"
                      value={formData?.socialMedia?.google}
                      onChange={handleInputChange}
                    />
                  </Grid>
                </Grid>
                <Grid container direction="row" className="mt-3 mx-5">
                  <Grid item xs={1} className="pt-2">
                    <Facebook />
                  </Grid>
                  <Grid item xs={11}>
                    <TextField
                      fullWidth
                      id="facebook"
                      type="string"
                      name="facebook"
                      autoComplete="facebook"
                      label="Facebook"
                      value={formData?.socialMedia?.facebook}
                      onChange={handleInputChange}
                    />
                  </Grid>
                </Grid>
                <Grid container direction="row" className="mt-3 mx-5">
                  <Grid item xs={1} className="pt-2">
                    <Twitter />
                  </Grid>
                  <Grid item xs={11}>
                    <TextField
                      fullWidth
                      id="twitter"
                      type="string"
                      name="twitter"
                      autoComplete="twitter"
                      label="Twitter"
                      value={formData?.socialMedia?.twitter}
                      onChange={handleInputChange}
                    />
                  </Grid>
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
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    </>
  );
}
