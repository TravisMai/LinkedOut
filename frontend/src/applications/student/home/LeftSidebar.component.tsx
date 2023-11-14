import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import DividerWithText from '../../../shared/components/DividerWithText';
import { useMutation, useQuery } from 'react-query';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Divider, IconButton, Link, List, ListItem, ListItemText, Stack, Typography } from '@mui/material';

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
  const [studentName, setStudentName] = useState("");

  // Fetch for student info
  const getJwtToken = () => {
    return document.cookie.split("; ").find((cookie) => cookie.startsWith("jwtToken="))?.split("=")[1];
  };

  const token = getJwtToken();

  // Fetch student info
  useQuery({
    queryKey: "student",
    queryFn: () => axios.get("http://localhost:5000/api/v1/student/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
    onSuccess: (data) => {
      setStudentName(data.data.name);
    }
  });


  // Mutation to logout
  const mutation = useMutation<ResponeType, ErrorType>({
    mutationFn: () => axios.post("http://localhost:5000/api/v1/student/logout", {}, {
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
            src="https://img.freepik.com/premium-photo/happy-young-students-studying-college-library-with-stack-books_21730-4486.jpg"
            className=" w-20 h-20 lg:w-36 lg:h-36 rounded-full mx-auto my-3 -mt-10 lg:-mt-16 border-2 border-white"
          />
        </div>
        <Container className='pb-2 pt-2'>
          <Typography variant="h5" component="div" className='text-center'> {token ? studentName : <div>Not Logged In</div>}</Typography>
          <Typography variant="body2" className='text-center text-gray-400'>Computer Engineering Student</Typography>
        </Container>
        <List component="nav" aria-label="mailbox folders" hidden={showContent}>
          <Divider />
          <ListItem button secondaryAction={
            <Typography>23</Typography>
          }>
            <ListItemText primary="Applied" >
            </ListItemText>
          </ListItem>
          <ListItem button secondaryAction={
            <Typography>2</Typography>
          }>
            <ListItemText primary="Approved" />
          </ListItem>
          <ListItem button secondaryAction={
            <Typography>153</Typography>
          }>
            <ListItemText primary="Message" />
          </ListItem>
          <ListItem button secondaryAction={
            <Typography>512</Typography>
          }>
            <ListItemText primary="Following" />
          </ListItem>
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
