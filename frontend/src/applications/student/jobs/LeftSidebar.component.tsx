import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { List, ListItem, ListItemText, Typography } from "@mui/material";
import { getJwtToken } from "../../../shared/utils/authUtils";
import { useQuery } from "react-query";
// import JobDisplay from './JobDisplay.component';

// type ResponeType = {
//   data: {
//     student: {
//       id: string;
//       name: string;
//       email: string;
//       phoneNumber: string;
//       avatar: string;
//       isGoogle: boolean;
//       isVerify: boolean;
//     };
//     token: string;
//   };
// }

// type ErrorType = {
//   response: {
//     data: {
//       message: string;
//     }
//   }
// }

const LeftSidebar: React.FC = () => {
  // const navigate = useNavigate();
  const [showContent] = useState(false);

  // Get jwt token

  const token = getJwtToken();

  // Get Student information
  const [studentData, setStudentData] = React.useState<studentType>();
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
      // console.log(getStudentInfo.data.data.id)
    }
  }, [getStudentInfo.isSuccess, getStudentInfo.data?.data]);

  useEffect(() => {
    if (getStudentInfo.isSuccess && getStudentInfo.data.data.id) {
      setStudentData(getStudentInfo.data.data);
    }
  }, [getStudentInfo.isSuccess, getStudentInfo.data?.data]);

  // Get all applied jobs
  const [appliedJobs, setAppliedJobs] = React.useState<jobApplicationType[]>(
    [],
  );
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
          console.log(response.data);
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

  // Get all job with status
  const appliedList = appliedJobs.filter(
    (job: jobApplicationType) => job.status === "Applied",
  );
  const approvedList = appliedJobs.filter(
    (job: jobApplicationType) => job.status === "Approved",
  );
  const pendingList = appliedJobs.filter(
    (job: jobApplicationType) => job.status === "Pending",
  );
  const rejectedList = appliedJobs.filter(
    (job: jobApplicationType) => job.status === "Rejected",
  );

  // const handleClick = () => {
  //   document.getElementById("my-section")?.scrollIntoView({ behavior: "smooth" });
  // };

  return (
    <div className="ml-7 mt-6 pb-6 h-fit lg:min-h-[500px] flex flex-col rounded-xl space-y-2 fixed">
      <div className="flex flex-col bg-white rounded-lg ">
        <List component="nav" aria-label="mailbox folders" hidden={showContent}>
          <ListItem
            secondaryAction={<Typography>{appliedList.length}</Typography>}
          >
            <ListItemText primary="Applied"></ListItemText>
          </ListItem>
          <ListItem
            secondaryAction={<Typography>{approvedList.length}</Typography>}
          >
            <ListItemText primary="Approved" />
          </ListItem>
          <ListItem
            secondaryAction={<Typography>{pendingList.length}</Typography>}
          >
            <ListItemText primary="Pending" />
          </ListItem>
          <ListItem
            secondaryAction={<Typography>{rejectedList.length}</Typography>}
          >
            <ListItemText primary="Rejected" />
          </ListItem>
        </List>
      </div>
    </div>
  );
};

export default LeftSidebar;
