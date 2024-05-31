import {
  AccountCircle,
  AttachFile,
  CalendarMonth,
  Email,
  Facebook,
  Fingerprint,
  GitHub,
  Google,
  Group,
  LinkedIn,
  More,
  Phone,
  School,
  Star,
  Twitter,
  WorkHistory,
  WorkspacePremium,
} from "@mui/icons-material";
import {
  Box,
  Container,
  Grid,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import CompanyAppBar from "../CompanyAppBar.component";
import { getJwtToken } from "../../../shared/utils/authUtils";
import { useMutation, useQuery } from "react-query";
import axios from "axios";
import { useParams } from "react-router-dom";
import { LoadingButton } from "@mui/lab";
import DefaultAvatar from "@/shared/assets/default-image.jpeg";

type ResponseType = {
  data: any;
};

export default function StudentProfile2() {
  const { applicantId } = useParams();

  const token = getJwtToken();

  // Fetch for applicant info

  const [applicant, setApplicant] = useState<jobApplicationType>();
  const [status, setStatus] = useState<string>("");

  useQuery({
    queryKey: "studentInfo",
    queryFn: () =>
      axios.get(
        `https://linkedout-hcmut.feedme.io.vn/api/v1/job_applicants/applicant/${applicantId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      ),
    onSuccess: (data) => {
      setApplicant(data.data);
      setStatus(data.data?.status);
    },
  });

  // Handle change status
  const [loading, setLoading] = React.useState(false);

  const handleUpdate = (status: string) => {
    setLoading(true);
    setTimeout(() => {
      setStatus(status);
      setLoading(false);
      mutation.mutate(status);
    }, 1000);
  };

  const mutation = useMutation<ResponseType, ErrorType, string>({
    mutationFn: (status: string) => {
      return axios.put(
        `https://linkedout-hcmut.feedme.io.vn/api/v1/job_applicants/update/${applicantId}`,
        { status: status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
    },
    onSuccess: () => {
      setLoading(false);
    },
    onError: () => {
      // console.log(mutation.error);
      setLoading(false);
    },
    onMutate: () => {
      setLoading(true);
    },
  });

  return (
    <>
      <CompanyAppBar />
      <Grid
        container
        spacing={2}
        className="bg-[#f3f2f0] min-h-screen"
        sx={{ mt: 1 }}
      >
        <Grid item xs={3}>
          <Container
            disableGutters={true}
            sx={{
              width: 9 / 10,
              bgcolor: "white",
              display: "flex",
              flexDirection: "column",
              gap: 2,
              borderRadius: 3,
              my: 3,
              pb: 3,
            }}
          >
            <Container
              disableGutters={true}
              sx={{
                alignContent: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 1,
              }}
            >
              <img
                src={
                  !applicant?.student?.avatar?.includes("https://scontent")
                    ? applicant?.student?.avatar
                    : DefaultAvatar
                    ?? DefaultAvatar
                }
                className=" w-full  rounded-t-xl mx-auto  border-2 border-blue-300"
              />
              {/* <Button variant="outlined" sx={{ mt: 1 }} size="small" onClick={() => handleOpenDialog("avatar")}>Change photo</Button>
                            {studentData?.isVerify ? <Chip color="success" icon={<Check />} label="Verified" /> : <Chip color="warning" icon={<ExclamationCircleOutlined />} label="Not Verified" />} */}
              {/* <Chip color="success" icon={<Check />} label="Verified" /> */}
            </Container>

            <Typography variant="body2" className="pl-5">
              {" "}
              <AccountCircle /> Name:{" "}
              <span className="font-bold">{applicant?.student.name} </span>{" "}
            </Typography>
            <Typography variant="body2" className="pl-5">
              <Fingerprint /> Student ID:{" "}
              <span className="font-bold">{applicant?.student.studentId} </span>
            </Typography>
            <Typography variant="body2" className="pl-5">
              <Email /> Email:{" "}
              <span className="font-bold">{applicant?.student.email} </span>
            </Typography>
            <Typography variant="body2" className="pl-5">
              <Phone /> Phone:{" "}
              <span className="font-bold">
                {applicant?.student.phoneNumber}{" "}
              </span>
            </Typography>
            <Typography variant="body2" className="pl-5">
              <Star /> Major:{" "}
              <span className="font-bold">{applicant?.student.major} </span>
            </Typography>
            <Typography variant="body2" className="pl-5">
              <CalendarMonth /> Year:{" "}
              <span className="font-bold">{applicant?.student.year} </span>
            </Typography>
            <Container
              disableGutters={true}
              sx={{
                alignContent: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              {/* <Button variant="outlined" color="warning" sx={{}} onClick={handleLogout} size="large">Logout</Button> */}
            </Container>
          </Container>
        </Grid>
        <Grid item xs={8.8}>
          <Container
            disableGutters={true}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              borderRadius: 3,
              my: 3,
              pb: 3,
            }}
          >
            <Box display={"flex"} flexDirection={"row"} gap={2}>
              <LoadingButton
                variant="contained"
                color="success"
                sx={{ mt: 1, width: 1 / 6 }}
                size="small"
                loading={loading}
                onClick={() => handleUpdate("Approved")}
                disabled={"Approved" === status}
              >
                Approve
              </LoadingButton>
              <LoadingButton
                variant="contained"
                color="primary"
                sx={{ mt: 1, width: 1 / 6 }}
                size="small"
                loading={loading}
                onClick={() => handleUpdate("Processing")}
                disabled={"Processing" === status}
              >
                Process
              </LoadingButton>
              <LoadingButton
                variant="contained"
                color="error"
                sx={{ mt: 1, width: 1 / 6 }}
                size="small"
                loading={loading}
                onClick={() => handleUpdate("Rejected")}
                disabled={"Rejected" === status}
              >
                Reject
              </LoadingButton>
            </Box>

            <Paper>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "left",
                  pl: 2,
                  pt: 2,
                  pb: 1,
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Résumé
                </Typography>
                {/* <IconButton size="small" onClick={() => handleOpenDialog("resume")}><Edit /></IconButton> */}
              </Box>
              <Typography variant="body2" sx={{ pl: 2, pb: 2 }}>
                <List>
                  {applicant?.resume.title ? (
                    <ListItem>
                      <ListItemIcon>
                        <AttachFile />
                      </ListItemIcon>
                      <Link href={applicant?.resume.url}>
                        <ListItemText primary={applicant?.resume.title} />
                      </Link>
                    </ListItem>
                  ) : (
                    <></>
                  )}
                </List>
              </Typography>
            </Paper>
            {/* Social media */}
            <Paper>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "left",
                  pl: 2,
                  pt: 2,
                  pb: 1,
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Social Media
                </Typography>
                {/* <IconButton size="small" onClick={() => handleOpenDialog("socialMedia")}><Edit /></IconButton> */}
              </Box>
              <Typography variant="body2" sx={{ pl: 2, pb: 2 }}>
                <List>
                  {applicant?.student?.socialMedia?.github ? (
                    <ListItem>
                      <ListItemIcon>
                        <GitHub />
                      </ListItemIcon>
                      <Link
                        href={applicant?.student?.socialMedia?.github}
                        target="_blank"
                      >
                        {applicant?.student?.socialMedia?.github}
                      </Link>
                    </ListItem>
                  ) : (
                    <></>
                  )}
                  {applicant?.student?.socialMedia?.linkedin ? (
                    <ListItem>
                      <ListItemIcon>
                        <LinkedIn />
                      </ListItemIcon>
                      <Link
                        href={applicant?.student?.socialMedia?.linkedin}
                        target="_blank"
                      >
                        {applicant?.student?.socialMedia?.linkedin}
                      </Link>
                    </ListItem>
                  ) : (
                    <></>
                  )}
                  {applicant?.student?.socialMedia?.facebook ? (
                    <ListItem>
                      <ListItemIcon>
                        <Facebook />
                      </ListItemIcon>
                      <Link
                        href={applicant?.student?.socialMedia?.facebook}
                        target="_blank"
                      >
                        {applicant?.student?.socialMedia?.facebook}
                      </Link>
                    </ListItem>
                  ) : (
                    <></>
                  )}
                  {applicant?.student?.socialMedia?.google ? (
                    <ListItem>
                      <ListItemIcon>
                        <Google />
                      </ListItemIcon>
                      <Link
                        href={applicant?.student?.socialMedia?.google}
                        target="_blank"
                      >
                        {applicant?.student?.socialMedia?.google}
                      </Link>
                    </ListItem>
                  ) : (
                    <></>
                  )}
                  {applicant?.student?.socialMedia?.twitter ? (
                    <ListItem>
                      <ListItemIcon>
                        <Twitter />
                      </ListItemIcon>
                      <Link
                        href={applicant?.student?.socialMedia?.twitter}
                        target="_blank"
                      >
                        {applicant?.student?.socialMedia?.twitter}
                      </Link>
                    </ListItem>
                  ) : (
                    <></>
                  )}
                </List>
              </Typography>
            </Paper>
            {/* Objective */}
            <Paper>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "left",
                  pl: 2,
                  pt: 2,
                  pb: 1,
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Objective
                </Typography>
                {/* <IconButton size="small" onClick={() => handleOpenDialog("objective")}><Edit /></IconButton> */}
              </Box>
              <Typography variant="body2" sx={{ pl: 2, pb: 2 }}>
                {applicant?.student?.objective}
              </Typography>
            </Paper>
            {/* Education */}
            <Paper>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "left",
                  pl: 2,
                  pt: 2,
                  pb: 1,
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Education
                </Typography>
                {/* <IconButton size="small" onClick={() => handleOpenDialog("education")}><Edit /></IconButton> */}
              </Box>
              <Typography variant="body2" sx={{ pl: 2, pb: 2 }}>
                <List>
                  {applicant?.student?.education ? (
                    applicant?.student?.education?.map((item) => (
                      <ListItem>
                        <ListItemIcon>
                          <School />
                        </ListItemIcon>
                        <ListItemText
                          primary={item.school}
                          secondary={
                            <React.Fragment>
                              {item.major && (
                                <Typography variant="body1">
                                  {item.major}
                                </Typography>
                              )}
                              {item.startTime && (
                                <Typography>
                                  {item.startTime} -{" "}
                                  {item.endTime ? item.endTime : "Present"}
                                </Typography>
                              )}
                              {item.gpa && (
                                <Typography>GPA: {item.gpa}</Typography>
                              )}
                            </React.Fragment>
                          }
                        />
                      </ListItem>
                    ))
                  ) : (
                    <></>
                  )}
                </List>
              </Typography>
            </Paper>
            {/* Working History */}
            <Paper>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "left",
                  pl: 2,
                  pt: 2,
                  pb: 1,
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Working History
                </Typography>
                {/* <IconButton size="small" onClick={() => handleOpenDialog("workingHistory")}><Edit /></IconButton> */}
              </Box>
              <Typography variant="body2" sx={{ pl: 2, pb: 2 }}>
                <List>
                  {applicant?.student?.workingHistory ? (
                    applicant?.student?.workingHistory?.map((item) => (
                      <ListItem>
                        <ListItemIcon>
                          <WorkHistory />
                        </ListItemIcon>
                        <ListItemText
                          primary={item.company}
                          secondary={
                            <React.Fragment>
                              {item.time && (
                                <Typography variant="body1">
                                  {item.time}
                                </Typography>
                              )}
                              {item.position && (
                                <Typography>Role: {item.position}</Typography>
                              )}
                              {item.task && (
                                <Typography>
                                  Responsibilities: {item.task}
                                </Typography>
                              )}
                            </React.Fragment>
                          }
                        />
                      </ListItem>
                    ))
                  ) : (
                    <></>
                  )}
                </List>
              </Typography>
            </Paper>
            {/* Certificate */}
            <Paper>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "left",
                  pl: 2,
                  pt: 2,
                  pb: 1,
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Certificate
                </Typography>
                {/* <IconButton size="small" onClick={() => handleOpenDialog("certificate")}><Edit /></IconButton> */}
              </Box>
              <Typography variant="body2" sx={{ pl: 2, pb: 2 }}>
                <List>
                  {applicant?.student?.certificate ? (
                    applicant?.student?.certificate?.map((item) => (
                      <ListItem>
                        <ListItemIcon>
                          <WorkspacePremium />
                        </ListItemIcon>
                        <ListItemText
                          primary={item.name}
                          secondary={
                            <React.Fragment>
                              <Typography variant="body1">
                                {item.issuedBy}
                              </Typography>
                              <Typography variant="body1">
                                {item.time}
                              </Typography>
                            </React.Fragment>
                          }
                        />
                      </ListItem>
                    ))
                  ) : (
                    <></>
                  )}
                </List>
              </Typography>
            </Paper>
            {/* Skill */}
            <Paper>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "left",
                  pl: 2,
                  pt: 2,
                  pb: 1,
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Skills
                </Typography>
                {/* <IconButton size="small" onClick={() => handleOpenDialog("skill")}><Edit /></IconButton> */}
              </Box>
              <Typography variant="body2" sx={{ pl: 2, pb: 2 }}>
                <List>
                  {applicant?.student?.skill ? (
                    applicant?.student?.skill?.map((item) => (
                      <ListItem>
                        <ListItemIcon>
                          <Star />
                        </ListItemIcon>
                        <ListItemText
                          secondary={
                            <React.Fragment>
                              <Typography variant="body1">
                                {item.name} {item.level && <> - {item.level}</>}
                              </Typography>
                            </React.Fragment>
                          }
                        />
                      </ListItem>
                    ))
                  ) : (
                    <></>
                  )}
                </List>
              </Typography>
            </Paper>
            {/* Additional Information */}
            <Paper>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "left",
                  pl: 2,
                  pt: 2,
                  pb: 1,
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Additional Information
                </Typography>
                {/* <IconButton size="small" onClick={() => handleOpenDialog("additionalInformation")}><Edit /></IconButton> */}
              </Box>
              <Typography variant="body2" sx={{ pl: 2, pb: 2 }}>
                <List>
                  {applicant?.student?.additionalInformation ? (
                    applicant?.student?.additionalInformation?.map((item) => (
                      <ListItem>
                        <ListItemIcon>
                          <More />
                        </ListItemIcon>
                        <ListItemText
                          primary={item.name}
                          secondary={
                            <React.Fragment>
                              <Typography variant="body1">
                                {item.level}
                              </Typography>
                            </React.Fragment>
                          }
                        />
                      </ListItem>
                    ))
                  ) : (
                    <></>
                  )}
                </List>
              </Typography>
            </Paper>
            {/* Reference */}
            <Paper>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "left",
                  pl: 2,
                  pt: 2,
                  pb: 1,
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Reference
                </Typography>
                {/* <IconButton size="small" onClick={() => handleOpenDialog("reference")}><Edit /></IconButton> */}
              </Box>
              <Typography variant="body2" sx={{ pl: 2, pb: 2 }}>
                <List>
                  {applicant?.student?.reference ? (
                    applicant?.student?.reference?.map((item) => (
                      <ListItem>
                        <ListItemIcon>
                          <Group />
                        </ListItemIcon>
                        <ListItemText
                          primary={item.name}
                          secondary={
                            <React.Fragment>
                              {item.email && (
                                <Typography variant="body1">
                                  Email: {item.email}
                                </Typography>
                              )}
                              {item.phone && (
                                <Typography>Phone: {item.phone}</Typography>
                              )}
                            </React.Fragment>
                          }
                        />
                      </ListItem>
                    ))
                  ) : (
                    <></>
                  )}
                </List>
              </Typography>
            </Paper>
          </Container>
        </Grid>
      </Grid>
    </>
  );
}
