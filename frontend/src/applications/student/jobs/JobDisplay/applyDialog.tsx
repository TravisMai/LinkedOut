import * as React from "react";
import Dialog from "@mui/material/Dialog";
import {
  Box,
  Container,
  CssBaseline,
  FormControl,
  FormControlLabel,
  IconButton,
  Link,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { LoadingButton } from "@mui/lab";
import { useQuery } from "react-query";
import axios from "axios";
import { useState } from "react";
import { getJwtToken } from "../../../../shared/utils/authUtils.ts";

export default function ApplyDialog({
  isApplied,
  chooseResume,
  state,
  onExit,
  onClose,
}: {
  isApplied: boolean;
  state: boolean;
  chooseResume: (resumeId: string) => void;
  onExit: () => void;
  onClose: () => void;
}) {
  // Exit is cancel
  const handleExit = () => {
    onExit();
  };
  // Close is confirm to apply
  const handleClose = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    chooseResume(resumeChoice);
    onClose();
  };

  // Handle choose resume
  const [resumeChoice, setResumeChoice] = React.useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setResumeChoice((event.target as HTMLInputElement).value);
  };

  // Fetch resumes
  const token = getJwtToken();
  const [currentResume, setCurrentResume] = useState<resumeType[]>([]); // State to store current resume

  useQuery({
    queryKey: "studentInfo2",
    queryFn: () =>
      axios.get("https://linkedout-hcmut.feedme.io.vn/api/v1/student/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    onSuccess: (data) => {
      // Set current resumes
      setCurrentResume(data.data.resume);
      setResumeChoice(
        data.data?.resume?.[0]?.id ?? "You don't have any resume yet",
      );
    },
    onError: (error: ErrorType) => {
      console.log(error.response.data.message);
    },
  });

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
        {/* Applied -> Confirm to remove application */}
        {isApplied && (
          // Confirm to remove application
          <Container component="main" style={{ width: "" }}>
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
                Do you want to remove application?
              </Typography>
              <Box
                component="form"
                onSubmit={handleClose}
                sx={{ mx: 4, mt: 5, mb: 2 }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "start",
                  }}
                >
                  <LoadingButton
                    // loading={sending}
                    fullWidth
                    type="submit"
                    variant="contained"
                    // disabled={showSuccess}
                    sx={{ mt: 2, mb: 2 }}
                  >
                    Remove application
                  </LoadingButton>
                </Box>
                {/* {showError && <Alert sx={{ mb: 2 }} severity="error">{mutation.error?.response.data.message}</Alert>}
                            {showSuccess && <Alert sx={{ mb: 2 }} severity="success">Update successfully. Back to main page...</Alert>} */}
              </Box>
            </Box>
          </Container>
        )}

        {/* Not applied -> Choose CV to apply */}
        {!isApplied && (
          <Container component="main" style={{ width: "" }}>
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
                Choose CV to apply
              </Typography>
              <Box
                component="form"
                onSubmit={handleClose}
                sx={{ mx: 4, mt: 5, mb: 2 }}
              >
                <FormControl>
                  <RadioGroup
                    aria-labelledby="demo-controlled-radio-buttons-group"
                    name="controlled-radio-buttons-group"
                    value={resumeChoice}
                    onChange={handleChange}
                  >
                    {currentResume.length > 0 ? currentResume?.map((resume, index) => (
                      <Link href={resume.url} key={index}>
                        <FormControlLabel
                          value={resume.id}
                          control={<Radio />}
                          label={resume.title}
                        />
                      </Link>
                    )) : "You must first upload a resume to apply"}
                    {/* <FormControlLabel value="female" control={<Radio />} label="Female" />
                                        <FormControlLabel value="male" control={<Radio />} label="Male" /> */}
                  </RadioGroup>
                </FormControl>
                {currentResume.length > 0 ?
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "start",
                    }}
                  >
                    <LoadingButton
                      // loading={sending}
                      fullWidth
                      type="submit"
                      variant="contained"
                      // disabled={showSuccess}
                      sx={{ mt: 2, mb: 2 }}
                    >
                      Apply
                    </LoadingButton>
                  </Box>
                : <div className="mt-3"></div>}
                {/* {showError && <Alert sx={{ mb: 2 }} severity="error">{mutation.error?.response.data.message}</Alert>}
                            {showSuccess && <Alert sx={{ mb: 2 }} severity="success">Update successfully. Back to main page...</Alert>} */}
              </Box>
            </Box>
          </Container>
        )}
      </Dialog>
    </React.Fragment>
  );
}
