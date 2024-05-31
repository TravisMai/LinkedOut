import * as React from "react";
import Dialog from "@mui/material/Dialog";
import { Alert, Box, Container, CssBaseline, Grid, IconButton, Link, TextField, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { AttachFile } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { useMutation, useQuery } from "react-query";
import { getJwtToken } from "../../../../shared/utils/authUtils";
import { useState } from "react";
import axios from "axios";

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

export default function UploadReportDialog({
  state,
  onExit,
  onClose,
  internshipId,
}: {
  state: boolean;
  onExit: () => void;
  onClose: () => void;
  internshipId: string;
}) {
  const handleExit = () => {
    onExit();
  };
  const handleClose = () => {
    onClose();
  };

  const [sending, setSending] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [currentReport, setCurrentReport] = useState<documentType>(); // State to store current documents
  const [showAddNew, setShowAddNew] = useState(false); // State to show/hide add new working history button

  const [formData, setFormData] = useState<{
    document: File | null;
    deleteDocumentID: string[];
    documentName: string;
  }>({
    document: null,
    deleteDocumentID: [],
    documentName: "Internship report",
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
      // Filter out the document with name "Internship report"
      setCurrentReport(data.data?.document?.filter((item: documentType) => item.name === "Internship report")?.[0]);
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
            formDataToSend.append("documentName", "Internship report"); // Append document name
            if (currentReport)
              formDataToSend.append("deleteDocumentID[]", currentReport.id);
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


  return (
    <React.Fragment>
      <Dialog open={state}>
        <IconButton
          edge="end"
          color="inherit"
          onClick={handleExit}
          aria-label="close"
          style={{ position: "absolute", right: 15, top: 15 }}
        >
          <CloseIcon />
        </IconButton>

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
              Upload Report
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
                {// Only display document with name "Internship report "
                  currentReport ?
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
                          <Link href={currentReport.url} target="_blank" rel="noreferrer">
                            <Typography variant="h6">{currentReport.name}</Typography>
                          </Link>
                        </Grid>
                        <Grid item xs={1} sx={{ justifyItems: "right" }}>

                        </Grid>
                      </Grid>
                    </>
                    : " No Internship report uploaded"
                }
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
                    Upload new report
                  </LoadingButton>
                </Grid>
              )}
              {showAddNew && (
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                  <TextField
                    required
                    fullWidth
                    id="document"
                    type="file"
                    name="document"
                    onChange={handleFileChange}
                  />
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

      </Dialog>
    </React.Fragment>
  );
}
