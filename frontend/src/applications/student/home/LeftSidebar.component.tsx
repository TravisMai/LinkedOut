import React, { useCallback, useEffect, useState } from "react";
import { useQuery } from "react-query";
import axios from "axios";
import {
  Container,
  Divider,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { getJwtToken } from "../../../shared/utils/authUtils";

const LeftSidebar: React.FC = () => {
  const [showContent] = useState(false);
  const token = getJwtToken();

  // Fetch for student info
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
    if (getStudentInfo.isSuccess && getStudentInfo.data?.data) {
      setStudentData(getStudentInfo.data.data);
    }
  }, [getStudentInfo.isSuccess, getStudentInfo.data?.data]);

  // Get all applied jobs
  const [appliedJobs, setAppliedJobs] = React.useState<jobApplicationType[]>();

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
          setAppliedJobs(response.data);
        })
        .catch((error) => {
          console.error("Error fetching applied jobs:", error);
        });
    },
    [token, setAppliedJobs],
  );

  useEffect(() => {
    if (studentData && studentData.id) {
      fetchAppliedJobs(studentData.id);
    }
  }, [studentData, fetchAppliedJobs]);

  // Count jobs with status
  const countAppliedJobs = appliedJobs?.filter(
    (job) => job.status === "Applied",
  ).length;
  const countApprovedJobs = appliedJobs?.filter(
    (job) => job.status === "Approved",
  ).length;

  // Mutation to logout

  return (
    <div className="w-4/5 mx-auto mt-6 pb-6 h-fit lg:min-h-[500px] flex flex-col rounded-xl space-y-2">
      <div className="flex flex-col bg-white rounded-lg ">
        <div className="flex flex-col">
          <img
            src="https://source.unsplash.com/random?wallpapers"
            className="w-full h-24 rounded-t-lg"
          />
          <img
            src={studentData?.avatar}
            className=" w-20 h-20 lg:w-36 lg:h-36 rounded-full mx-auto my-3 -mt-10 lg:-mt-16 border-2 border-white"
          />
        </div>
        <Container className="pb-2 pt-2">
          <Typography variant="h5" component="div" className="text-center">
            {" "}
            {token ? studentData?.name : <div>Not Logged In</div>}
          </Typography>
          <Typography variant="body2" className="text-center text-gray-400">
            {studentData?.major} Student{" "}
          </Typography>
        </Container>
        <List component="nav" aria-label="mailbox folders" hidden={showContent}>
          <Divider />
          <ListItem
            button
            secondaryAction={<Typography>{countAppliedJobs}</Typography>}
          >
            <ListItemText primary="Jobs Applied"></ListItemText>
          </ListItem>
          <ListItem
            button
            secondaryAction={<Typography>{countApprovedJobs}</Typography>}
          >
            <ListItemText primary="Jobs Approved" />
          </ListItem>
          {/* <ListItem button secondaryAction={
            <Typography>153</Typography>
          }>
            <ListItemText primary="Message" />
          </ListItem>
          <ListItem button secondaryAction={
            <Typography>512</Typography>
          }>
            <ListItemText primary="Following" />
          </ListItem> */}
        </List>
      </div>
      {/* {!showContent && (
        <Button variant="text" className="lg:invisible text-center mt-2" onClick={toggleContent}>
          <DividerWithText
            text='Show more'
            muiElementIcon={<KeyboardArrowDownIcon />}
          />
        </Button>
      )}
      {showContent && (
        <Button variant="text" className="lg:invisible text-center mt-2" onClick={toggleContent}>
          <DividerWithText
            text='Show less'
            muiElementIcon={<KeyboardArrowUpIcon />}
          />
        </Button>
      )} */}
    </div>
  );
};

export default LeftSidebar;
