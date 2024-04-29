import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import DividerWithText from '../../../shared/components/DividerWithText';
import { useMutation, useQuery } from 'react-query';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Divider, IconButton, Link, List, ListItem, ListItemText, Stack, Typography } from '@mui/material';
import { getJwtToken } from '../../../shared/utils/authUtils';

type ResponeType = {
  data: {
    student: {
      id: string;
      name: string;
      email: string;
      phoneNumber: string;
      avatar: string;
      isGoogle: boolean;
      isVerify: boolean;
    };
    token: string;
  };
}

type ErrorType = {
  response: {
    data: {
      message: string;
    }
  }
}

const LeftSidebar: React.FC = () => {
  const navigate = useNavigate();
  const [showContent, setShowContent] = useState(false);
  const token = getJwtToken();


  // Fetch for student info
  // Get Student information
  const [studentData, setStudentData] = React.useState<studentType>([]);
  const getStudentInfo = useQuery({
    queryKey: "studentInfo",
    queryFn: () => axios.get("http://52.163.112.173:4000/api/v1/student/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  });
  useEffect(() => {
    if (getStudentInfo.isSuccess) {
      setStudentData(getStudentInfo.data.data);
      // console.log(getStudentInfo.data.data.id)
    }
  }, [getStudentInfo.isSuccess]);

  useEffect(() => {
    if (getStudentInfo.isSuccess && getStudentInfo.data.data.id) {
      setStudentData(getStudentInfo.data.data);
    }
  }, [getStudentInfo.isSuccess]);


  // Get all applied jobs
  const [appliedJobs, setAppliedJobs] = React.useState<jobApplicationType[]>();
  const fetchAppliedJobs = (studentId: string) => {
    axios.get(`http://52.163.112.173:4000/api/v1/job_applicants/candidate/${studentId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => {
        console.log(response.data);
        setAppliedJobs(response.data);
      })
      .catch(error => {
        console.error("Error fetching applied jobs:", error);
      });
  };

  useEffect(() => {
    if (studentData && studentData.id) {
      fetchAppliedJobs(studentData.id);
    }
  }, [studentData]);

  // Count jobs with status
  const countAppliedJobs = appliedJobs?.filter(job => job.status === "Applied").length;
  const countApprovedJobs = appliedJobs?.filter(job => job.status === "Approved").length;
  const countPendingJobs = appliedJobs?.filter(job => job.status === "Pending").length;
  const countRejectedJobs = appliedJobs?.filter(job => job.status === "Rejected").length;


  // Mutation to logout
  const mutation = useMutation<ResponeType, ErrorType>({
    mutationFn: () => axios.post("http://52.163.112.173:4000/api/v1/student/logout", {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
    onSuccess: () => {
      document.cookie = `jwtToken=; expires=${new Date(Date.now() - 60 * 60 * 1000)}; path=/`;
      // Delete cookie

      console.log("Logout successfully");
      // setSending(false);
      // setShowError(false);
      // setShowSuccess(true);
      setTimeout(() => {
        // setShowSuccess(false); // Hide the success message
        navigate('/'); // Navigate to the next screen
      }, 1000);
    },
    onError: (error) => {
      // setSending(false);
      // setShowError(true);
      console.log("Logout failed");
      console.log(error);
    },
    onMutate: () => {
      console.log(token);
      // setSending(true);
      // setShowError(false);
    }
  }
  );


  const handleLogout = () => {
    mutation.mutate();
  }

  // Toggle show more/less
  const toggleContent = () => {
    setShowContent(!showContent);
  };

  return (
    <div className="w-4/5 mx-auto mt-6 pb-6 h-fit lg:min-h-[500px] flex flex-col rounded-xl space-y-2">

      <div className='flex flex-col bg-white rounded-lg '>
        <div className='flex flex-col'>
          <img
            src="https://source.unsplash.com/random?wallpapers"
            className="w-full h-24 rounded-t-lg"
          />
          <img
            src={studentData.avatar}
            className=" w-20 h-20 lg:w-36 lg:h-36 rounded-full mx-auto my-3 -mt-10 lg:-mt-16 border-2 border-white"
          />
        </div>
        <Container className='pb-2 pt-2'>
          <Typography variant="h5" component="div" className='text-center'> {token ? studentData.name : <div>Not Logged In</div>}</Typography>
          <Typography variant="body2" className='text-center text-gray-400'>{studentData.major} Student </Typography>
        </Container>
        <List component="nav" aria-label="mailbox folders" hidden={showContent}>
          <Divider />
          <ListItem button secondaryAction={
            <Typography>{countAppliedJobs}</Typography>
          }>
            <ListItemText primary="Jobs Applied" >
            </ListItemText>
          </ListItem>
          <ListItem button secondaryAction={
            <Typography>{countApprovedJobs}</Typography>
          }>
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
