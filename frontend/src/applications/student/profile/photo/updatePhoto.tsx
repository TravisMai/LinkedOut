import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useMutation, useQuery } from "react-query";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import Alert from '@mui/material/Alert';
import { useEffect, useState } from 'react';
import LoadingButton from '@mui/lab/LoadingButton';
import MenuItem from '@mui/material/MenuItem';
import InputAdornment from '@mui/material/InputAdornment';
import { getJwtToken } from '../../../../shared/utils/authUtils';

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

type ResposeType = {
  data: {
    id: string;
    name: string;
    email: string;
    phoneNumber: string;
    avatar: string;
    isGoogle: boolean;
    isVerify: boolean;

  };
}

type ErrorType = {
  response: {
    data: {
      message: string;
    }
  }
}

interface updateForm {
  myfile: string;
}

export default function UpdatePhoto({ state, onClose }: { state: boolean, onClose: () => void }) {
  const handleClose = () => {
    onClose();
  };

  const navigate = useNavigate();
  const [sending, setSending] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [studentId, setStudentId] = useState('');
  const [filePreview, setFilePreview] = useState<string | null>(null); // State to store file preview URL

  const [formData, setFormData] = useState({
    myfile: '',
  });

  // Get jwt token
  const token = getJwtToken();

  // Fetch current information
  useQuery({
    queryKey: "currentInfo",
    queryFn: () => axios.get("http://localhost:4000/api/v1/student/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
    onSuccess: (data) => {
      console.log(data);

      // Set student id
      setStudentId(data.data.id);

    }
  });

  // Mutation to send form data to server    
  const mutation = useMutation<ResposeType, ErrorType, updateForm>({
    mutationFn: (formData) => {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null) {
          if (key === 'myfile') {
            formDataToSend.append(key, value as File); // Append file to FormData
          }
        }
      });
      return axios.put(`http://localhost:4000/api/v1/student/${studentId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Set content type for file upload
          Authorization: `Bearer ${token}`,
        },
      });
    },
    onSuccess: (data) => {
      console.log(data);
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
    }
  }
  );

  // Handlde submission
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log(formData);
    mutation.mutate(formData);
  };

  // Handle file input change
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; // Get the first file from the input
    setFormData((prevData: any) => ({
      ...prevData,
      myfile: file, // Update the myfile field with the selected file
    }));
    if (file) {
      setFilePreview(URL.createObjectURL(file)); // Generate preview URL for the selected file
    } else {
      setFilePreview(null); // Clear preview if no file is selected
    }
  };



  return (
    <>
      <ThemeProvider theme={defaultTheme}>
        <Container component="main" maxWidth="xs" >
          <CssBaseline />
          <Box
            sx={{
              marginTop: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Typography component="h1" variant="h5">
              Change Profile Photo
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="myfile"
                    type="file"
                    // Image only
                    name="myfile"
                    autoComplete="myfile"
                    onChange={handleFileChange}
                  />
                </Grid>
              </Grid>
              {/* Display current photo */}
              <img
                src={filePreview}
                className="my-3"
              />

              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }}>
                <LoadingButton
                  loading={sending}
                  fullWidth
                  type="submit"
                  variant="contained"
                  disabled={showSuccess}
                  sx={{ mt: 2, mb: 2 }}
                >
                  Update Photo
                </LoadingButton>
              </Box>
              {showError && <Alert sx={{ mb: 2 }} severity="error">{mutation.error?.response.data.message}</Alert>}
              {showSuccess && <Alert sx={{ mb: 2 }} severity="success">Update successfully. Back to main page...</Alert>}
              <Grid container justifyContent="flex-end">

              </Grid>
            </Box>
          </Box>
        </Container>
      </ThemeProvider >

    </>
  );
}
