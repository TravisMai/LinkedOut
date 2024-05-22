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
import Alert from "@mui/material/Alert";
import { useEffect, useState } from "react";
import LoadingButton from "@mui/lab/LoadingButton";
import { getJwtToken } from "../../../../shared/utils/authUtils";
import { Delete, More } from "@mui/icons-material";
import DividerWithText from "../../../../shared/components/DividerWithText";

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

type ResponseType = {
  data: {
    additionalInformation: additionalInformationType[];
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
  additionalInformation: additionalInformationType[];
}

export default function UpdateAdditionalInformation({
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

  const [formData, setFormData] = useState<{
    additionalInformation: additionalInformationType[];
  }>({
    additionalInformation: [],
  });

  // Get jwt token
  const token = getJwtToken();

  // Fetch current information
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://linkedout-hcmut.feedme.io.vn/api/v1/student/me",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        const data = response.data;

        // Set student id
        setStudentId(data.id);

        // Update formData with social media data
        const updatedFormData = {
          additionalInformation: data.additionalInformation ?? [],
        };

        setFormData(updatedFormData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [token]);

  // Mutation to send form data to server
  const mutation = useMutation<ResponseType, ErrorType, updateForm | null>({
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
    console.log(formData);
    mutation.mutate(formData);
  };

  // Handle input change
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;
    const [index, key] = id.split("-");
    const updatedFormData = { ...formData };
    const idx = parseInt(index);
    updatedFormData.additionalInformation[idx][
      key as keyof additionalInformationType
    ] = value;
    setFormData(updatedFormData);
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
              Update Other Information
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{ mx: 2, mt: 5, mb: 2 }}
            >
              <Grid container spacing={2} justifyContent="center">
                {formData.additionalInformation?.map(
                  (item: additionalInformationType, index) => (
                    <Grid
                      container
                      direction="row"
                      spacing={1}
                      className="mt-3 mx-5 mb-6"
                    >
                      <Grid item xs={11} spacing={2} className="space-y-3">
                        <TextField
                          fullWidth
                          required
                          id={`${index}-name`}
                          name="name"
                          type="string"
                          label="Field"
                          value={item.name}
                          onChange={handleInputChange}
                        />
                        <TextField
                          fullWidth
                          id={`${index}-level`}
                          type="string"
                          label="Content"
                          value={item.level}
                          onChange={handleInputChange}
                        />
                      </Grid>
                      <Grid item xs={1}>
                        {/* Delete current field */}
                        <LoadingButton
                          loading={sending}
                          variant="outlined"
                          color="error"
                          onClick={() => {
                            const updatedFormData = { ...formData };
                            updatedFormData.additionalInformation.splice(
                              index,
                              1,
                            );
                            setFormData(updatedFormData);
                          }}
                          // sx={{ mt: 1, mb: 2 }}
                        >
                          <Delete />
                        </LoadingButton>
                      </Grid>
                      <DividerWithText
                        className="mt-5"
                        text=""
                        muiElementIcon={<More />}
                      />
                    </Grid>
                  ),
                )}
              </Grid>
              {/* Add new additionalInformation */}
              <Grid container justifyContent="center">
                <LoadingButton
                  loading={sending}
                  variant="contained"
                  onClick={() => {
                    const updatedFormData = { ...formData };
                    updatedFormData.additionalInformation.push({
                      name: "",
                      level: "",
                    });
                    setFormData(updatedFormData);
                  }}
                  sx={{ mt: 2, mb: 2 }}
                >
                  Add New Information
                </LoadingButton>
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
