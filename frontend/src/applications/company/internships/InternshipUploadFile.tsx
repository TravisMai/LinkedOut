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
import { getJwtToken } from "../../../shared/utils/authUtils";
import { AttachFile, Delete } from "@mui/icons-material";
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

type ResponseType = {
  data: {
    documents: documentType[] | null;
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
  document: File | null;
  deleteDocumentID: string[];
  documentName: string;
}

export default function UploadFile({
  onClose,
  internshipId,
}: {
  onClose: () => void;
  internshipId: string;
}) {
  const handleClose = () => {
    onClose();
  };

  const [sending, setSending] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [currentDocuments, setCurrentDocuments] = useState<documentType[]>([]); // State to store current documents
  const [showAddNew, setShowAddNew] = useState(false); // State to show/hide add new working history button

  const [formData, setFormData] = useState<{
    document: File | null;
    deleteDocumentID: string[];
    documentName: string;
  }>({
    document: null,
    deleteDocumentID: [],
    documentName: "---",
  });

  // Get jwt token
  const token = getJwtToken();

  // Fetch current information
  useQuery({
    queryKey: "internshipInfo",
    queryFn: () =>
      axios.get(`https://linkedout-hcmut.feedme.io.vn/api/v1/internship/${internshipId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    onSuccess: (data) => {
      // Set current document
      setCurrentDocuments(data.data.document);
    },
  });

  // Mutation to send form data to server
  const mutation = useMutation<ResponseType, ErrorType, updateForm>({
    mutationFn: (formData) => {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null) {
          if (key === "document") {
            formDataToSend.append(key, value as File); // Append file to FormData
          }
          else if (key === "documentName") {
            if (value !== "---") {
              formDataToSend.append(key, value);
            }
          }
          else if (key === "deleteDocumentID") // add deleteDocumentID array as an array
          {
            (value as string[]).forEach((id) => {
              formDataToSend.append("deleteDocumentID[]", id);
            })
          }
        }
      });
      return axios.put(
        `https://linkedout-hcmut.feedme.io.vn/api/v1/internship/${internshipId}`,
        formDataToSend,
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
      document: file, // Update the myfile field with the selected file
    }));
  };

  // Handle document type change
  const handleChooseDocumentName = (event: SelectChangeEvent) => {
    const { value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      documentName: value,
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
              Upload File
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
                {currentDocuments?.map((item: documentType, index) => (
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
                          <Typography variant="h6">{item.name}</Typography>
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
                            if (updatedFormData?.deleteDocumentID === null) {
                              updatedFormData.deleteDocumentID = [item.id];
                            } else {
                              updatedFormData.deleteDocumentID.push(item.id);
                            }
                            setFormData(updatedFormData);
                            // Also delete the field from current documents
                            currentDocuments.splice(index, 1);
                          }}
                        >
                          <Delete />
                        </LoadingButton>
                      </Grid>
                    </Grid>
                  </>
                )) ?? ""}
              </Grid>
              {/* Add new document */}
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
                  <Grid container direction={"column"} spacing={2}>
                    <Grid item>
                      <FormControl sx={{ minWidth: 200 }}>
                        <InputLabel id="demo-simple-select-helper-label">Type</InputLabel>
                        <Select
                          labelId="documentName-select"
                          id="documentName-select"
                          value={formData.documentName === "---" ? "" : formData.documentName}
                          label="Type"
                          onChange={handleChooseDocumentName}
                        >
                          <MenuItem value={"Recruiting result"}>Recruiting result</MenuItem>
                          <MenuItem value={"Internship result"}>Internship result</MenuItem>
                          <MenuItem value={"Internship evaluation"}>Internship evaluation</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item>
                      <TextField
                        required
                        id="document"
                        type="file"
                        name="document"
                        onChange={handleFileChange}
                      />
                    </Grid>
                  </Grid>
                </Box>
              )}
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
