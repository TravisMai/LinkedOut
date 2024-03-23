import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Divider, Grid, IconButton, Link, List, ListItem, ListItemText, Stack, Typography } from '@mui/material';
import JobDisplay from './JobDisplay.component';
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

  // Fetch for student info
  

  const token = getJwtToken();


  const handleClick = () => {
    document.getElementById("my-section")?.scrollIntoView({ behavior: "smooth"});
  };

  return (
    
    <div className="ml-7 mt-6 pb-6 h-fit lg:min-h-[500px] flex flex-col rounded-xl space-y-2 fixed">
      <div className='flex flex-col bg-white rounded-lg '>

        <List component="nav" aria-label="mailbox folders" hidden={showContent}>
          <ListItem button onClick={handleClick} secondaryAction={
            <Typography>19</Typography>
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
            <Typography>11</Typography>
          }>
            <ListItemText primary="Pending" />
          </ListItem>
          <ListItem button secondaryAction={
            <Typography>6</Typography>
          }>
            <ListItemText primary="Rejected" />
          </ListItem>
        </List>
      </div>
    </div>
  );
};

export default LeftSidebar;
