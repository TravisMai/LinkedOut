import {
  Apartment,
  Check,
  Email,
  FileUpload,
  PriorityHigh,
  Search,
  Work,
} from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import {
  Container,
  Grid,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { getJwtToken } from "../../../../shared/utils/authUtils";
import ApplyDialog from "./applyDialog";

const processList = ["Intern", "Received"];

const JobDisplay: React.FC = () => {
  // Get jwt token
  const token = getJwtToken();

  const { jobId } = useParams();
  const [job, setJob] = useState<jobType>();

  // Appilcant status
  const [status, setStatus] = useState<string>("");

  // Fetch job information
  useQuery({
    queryKey: "thisJob",
    queryFn: () =>
      axios.get("https://linkedout-hcmut.feedme.io.vn/api/v1/job/" + jobId, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    onSuccess: (data) => {
      setJob(data.data);
    },
  });

  // Handle apply button
  const [loading, setLoading] = React.useState(false);
  const [applied, setApplied] = React.useState(false);
  const [appliedIntern, setAppliedIntern] = React.useState(false);
  const [showError, setShowError] = useState(false);

  const [resumeId, setResumeId] = useState<string>("");

  function handleClickApply() {
    setLoading(true);
    handleOpenDialog();
  }

  const [applyingInternship, setApplyingInternship] = useState(false);
  function handleClickApplyInternship() {
    if (!applied)
      handleOpenDialog();
    else
      mutationApplyInternship.mutate();
    setLoading(true);
    setApplyingInternship(true);
  }

  const mutationApply = useMutation<ResponseType, ErrorType>({
    mutationFn: () => {
      return axios.post(
        `https://linkedout-hcmut.feedme.io.vn/api/v1/job_applicants/${jobId}`,
        { resumeId: resumeId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
    },
    onSuccess: () => {
      if (applyingInternship)
        mutationApplyInternship.mutate();
      else {
        if (appliedIntern)
          setAppliedIntern(!appliedIntern);
        setLoading(false);
        setShowError(false);
        setApplied(!applied);
      }
    },
    onError: () => {
      console.log(mutationApply.error);
      setLoading(false);
      setShowError(true);
    },
  });

  const mutationApplyInternship = useMutation<ResponseType, ErrorType>({
    mutationFn: () => {
      return axios.post(
        `https://linkedout-hcmut.feedme.io.vn/api/v1/internship/${jobId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
    },
    onSuccess: () => {
      setLoading(false);
      setShowError(false);
      setApplied(!applied);
      setAppliedIntern(!appliedIntern);
    },
    onError: () => {
      console.log(mutationApplyInternship.error);
      setLoading(false);
      setShowError(true);
    },
    onMutate: () => {
      // setLoading(true);
      // setShowError(false);
    },
  });

  // Get Student information
  const [studentData, setStudentData] = React.useState<studentType | null>(
    null,
  );
  const getStudentInfo = useQuery({
    queryKey: "studentInfo",
    queryFn: () =>
      axios.get("https://linkedout-hcmut.feedme.io.vn/api/v1/student/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
  });
  useEffect(() => {
    if (getStudentInfo.isSuccess) {
      setStudentData(getStudentInfo.data.data);
    }
  }, [getStudentInfo.isSuccess, getStudentInfo.data?.data]);

  useEffect(() => {
    if (getStudentInfo.isSuccess && getStudentInfo.data.data.id) {
      setStudentData(getStudentInfo.data.data);
    }
  }, [getStudentInfo.isSuccess, getStudentInfo.data?.data]);

  const [isInternship, setIsInternship] = useState(false);
  const [isInternStudent, setIsInternStudent] = useState(false);

  // Check if student can apply for intern (check within a list)
  useEffect(() => {
    if (studentData && processList.includes(studentData.process)) {
      setIsInternStudent(true);
    }
  }, [studentData]);

  // Check if job type is internship
  useEffect(() => {
    if (job && job.workType === "Internship") {
      setIsInternship(true);
    }
  }, [job]);

  // Check submitted
  // Get all applied jobs
  const fetchAppliedJobs = useCallback(
    (studentId: string) => {
      axios
        .get(
          `https://linkedout-hcmut.feedme.io.vn/api/v1/job_applicants/candidate/${studentId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )
        .then((response) => {
          if (response.data && response.data.length > 0) {
            response.data.forEach((job: jobApplicationType) => {
              if (job.job.id === jobId) {
                setApplied(true);
                setStatus(job.status);
              }
            });
          }
        })
        .catch((error) => {
          console.error("Error fetching applied jobs:", error);
        });
    },
    [token, jobId, setApplied, setStatus],
  );

  const [thisIntern, setThisIntern] = useState<internshipType>();
  const fetchAppliedIntern = useCallback(
    (studentId: string) => {
      axios
        .get(
          `https://linkedout-hcmut.feedme.io.vn/api/v1/internship/candidate/${studentId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )
        .then((response) => {
          if (response.data && response.data.length > 0) {
            response.data.forEach((intern: internshipType) => {
              if (intern.jobApplicants.job.id === jobId) {
                setThisIntern(intern);
                setAppliedIntern(true);
              }
            });
          }
        })
        .catch((error) => {
          console.error("Error fetching applied jobs:", error);
        });
    },
    [token, jobId, setAppliedIntern],
  );

  useEffect(() => {
    if (studentData && studentData.id) {
      fetchAppliedJobs(studentData.id);
      fetchAppliedIntern(studentData.id);
    }
  }, [studentData, fetchAppliedJobs, fetchAppliedIntern]);

  useEffect(() => {
    if (studentData && studentData.id) {
      fetchAppliedJobs(studentData.id);
      fetchAppliedIntern(studentData.id);
    }
  }, [studentData, fetchAppliedIntern, fetchAppliedJobs]);

  // // Handle dialog
  const [openDialog, setOpenDialog] = React.useState(false);
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  // Close is confirm to apply
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setTimeout(() => {
      mutationApply.mutate();

    }, 1000);
  };

  // Exit is cancel
  const handleExit = () => {
    setOpenDialog(false);
    setLoading(false);
  };

  return (
    <Container>
      <Grid container spacing={2} sx={{ mt: 3 }}>
        <Grid item xs={7}>
          <Box display="flex" gap={3}>
            <Typography variant="h4">{job?.title}</Typography>
            {status !== "Rejected" &&
              status !== "Processing" &&
              status !== "Approved" && (
                <>
                  <LoadingButton
                    variant="outlined"
                    color={showError ? "error" : "primary"}
                    onClick={handleClickApply}
                    loading={loading}
                    disabled={!studentData?.isVerify}
                    type="button"
                  >
                    {!applied && !showError ? (
                      "Apply"
                    ) : showError ? (
                      <>
                        <PriorityHigh />
                        Error
                      </>
                    ) : (
                      <>
                        {" "}
                        <Check />
                        Applied
                      </>
                    )}
                  </LoadingButton>
                  {isInternship && isInternStudent && (
                    <LoadingButton
                      variant="outlined"
                      color="success"
                      onClick={handleClickApplyInternship}
                      loading={loading}
                      disabled={!studentData?.isVerify}
                    >
                      {!appliedIntern && !showError ? (
                        "Apply Intern"
                      ) : showError ? (
                        <>
                          <PriorityHigh />
                          Error
                        </>
                      ) : (
                        <>
                          {" "}
                          <Check />
                          Applied Intern
                        </>
                      )}
                    </LoadingButton>
                  )}
                </>
              )}
          </Box>

          {status === "Rejected" ? (
            <Typography variant="h6" sx={{ marginTop: 1, color: "red" }}>
              You are not qualified for this job
            </Typography>
          ) : status === "Processing" ? (
            <Typography variant="h6" sx={{ marginTop: 1, color: "blue" }}>
              Your application is being processed
            </Typography>
          ) : status === "Approved" ? (
            <Typography
              variant="h6"
              sx={{ marginTop: 1, color: "green", fontWeight: "bold" }}
            >
              You has been approved for this job
            </Typography>
          ) : (
            <></>
          )}

          {isInternship && (
            <Typography
              variant="h5"
              sx={{
                my: 2,
                fontStyle: "italic",
                color: "green",
                textAlign: "center",
                mr: 10,
              }}
            >
              {" "}
              Job available for internship{" "}
            </Typography>
          )}

          {status === "Approved" && isInternship ?
            <>
              {/* Bullet list of documents */}
              <Box
                sx={{ display: "flex", alignItems: "left" }}
              >
                <Typography variant="h6" sx={{ mt: 2 }}>Documents</Typography>
                <IconButton
                  size="small"
                  sx={{ mt: 1, ml: 1 }}
                // onClick={() => handleOpenDialog("resume")}
                >
                  <FileUpload />
                </IconButton>
              </Box>
              <List sx={{ mb: 2 }}>
                {thisIntern?.document?.map((document, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <Search />
                    </ListItemIcon>
                    <ListItemText primary={document}></ListItemText>
                  </ListItem>
                )) ?? "No document uploaded"}
              </List>
            </>
            : ""
          }


          <Box
            display="flex"
            width={4 / 5}
            justifyContent="space-evenly"
            sx={{ my: 3, border: 1, borderRadius: 3 }}
          >
            <Box display="flex" flexDirection="column" alignItems="center">
              <Typography variant="h5">Open Date</Typography>
              <Typography variant="h6">
                {job?.openDate?.toString()?.split("T")?.[0] ?? "---"}
              </Typography>
            </Box>
            <Box display="flex" flexDirection="column" alignItems="center">
              <Typography variant="h5">Close Date</Typography>
              <Typography variant="h6">
                {job?.expireDate?.toString()?.split("T")?.[0] ?? "---"}
              </Typography>
            </Box>
          </Box>
          <Typography variant="h6">Description</Typography>
          <List sx={{ mb: 2 }}>
            <ListItem>
              <ListItemText
                primary={job?.descriptions?.aboutUs ?? ""}
              ></ListItemText>
            </ListItem>
          </List>
          <Typography variant="h6">Level</Typography>
          <List sx={{ mb: 2 }}>
            <ListItem>
              <ListItemText primary={job?.workType}></ListItemText>
            </ListItem>
          </List>
          {isInternship && (
            <>
              <Typography variant="h6">Internship Program</Typography>
              <List sx={{ mb: 2 }}>
                <ListItem>
                  <Link href={job?.internshipPrograme}>
                    {" "}
                    <ListItemText
                      primary={job?.company.name + " INTERNSHIP PROGRAM"}
                    ></ListItemText>
                  </Link>
                </ListItem>
              </List>

              <Typography variant="h6">Quantity</Typography>
              <List sx={{ mb: 2 }}>
                <ListItem>
                  <ListItemText
                    primary="Required"
                    secondary={job?.quantity}
                  ></ListItemText>
                  <ListItemText
                    primary="Registered"
                    secondary={job?.quantity}
                  ></ListItemText>
                  <ListItemText
                    primary="Accepted"
                    secondary={job?.quantity}
                  ></ListItemText>
                  <ListItemText
                    primary="Max Accept"
                    secondary={job?.quantity}
                  ></ListItemText>
                </ListItem>
              </List>
            </>
          )}
          <Typography variant="h6">Responsibities</Typography>
          <List sx={{ mb: 2 }}>
            {job?.descriptions?.responsibilities?.map(
              (responsibility, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <Search />
                  </ListItemIcon>
                  <ListItemText primary={responsibility}></ListItemText>
                </ListItem>
              ),
            ) ?? ""}
          </List>
          <Typography variant="h6">Requirements</Typography>
          <List sx={{ mb: 2 }}>
            {job?.descriptions?.requirements?.map((requirement, index) => (
              <ListItem key={index}>
                <ListItemIcon>
                  <Check />
                </ListItemIcon>
                <ListItemText primary={requirement}></ListItemText>
              </ListItem>
            )) ?? ""}
          </List>
          <Typography variant="h6">Level</Typography>
          <List sx={{ mb: 2 }}>
            <ListItem>
              <ListItemText primary={job?.level}></ListItemText>
            </ListItem>
          </List>
          <Typography variant="h6">Salary</Typography>
          <List sx={{ mb: 2 }}>
            <ListItem>
              <ListItemText
                primary={job?.salary ? job.salary : "None"}
              ></ListItemText>
            </ListItem>
          </List>
        </Grid>
        <Grid item xs={4}>
          <Link href={"/student/companies/" + job?.company.id}>
            <img
              src={job?.company.avatar}
              className="w-full object-cover rounded-xl border-2 border-gray-200 mb-2"
              alt="company avatar"
            />
          </Link>
          <Typography variant="h6">{job?.company.name}</Typography>

          <List>
            <Typography variant="h6">Work Field</Typography>
            <ListItem>
              <ListItemIcon>
                <Work />
              </ListItemIcon>
              <ListItemText primary={job?.company.workField}></ListItemText>
            </ListItem>
            <Typography variant="h6">Address</Typography>
            <ListItem>
              <ListItemIcon>
                <Apartment />
              </ListItemIcon>
              <ListItemText primary={job?.company.address}></ListItemText>
            </ListItem>
            <Typography variant="h6">Contact</Typography>
            <ListItem>
              <ListItemIcon>
                <Email />
              </ListItemIcon>
              <ListItemText primary={job?.company.email}></ListItemText>
            </ListItem>
          </List>
        </Grid>
      </Grid>
      <ApplyDialog
        isApplied={applied}
        chooseResume={setResumeId}
        state={openDialog}
        onExit={handleExit}
        onClose={handleCloseDialog}
      />
      <ApplyDialog
        isApplied={applied}
        chooseResume={setResumeId}
        state={openDialog}
        onExit={handleExit}
        onClose={handleCloseDialog}
      />
    </Container >
  );
};

export default JobDisplay;
