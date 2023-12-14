import React from 'react';
import { Container, TextField, Button, List, ListItem, ListItemText, Divider, Grid, ListItemButton, } from '@mui/material';
import { KeyboardArrowDown } from '@mui/icons-material';
import ChatHistory from './chatHistory.component';
import CompanyAppBar from './CompanyAppBar.component';

const recentMessages = [{ user: "Tran Tri Dat", message: "Hi, please reply to me", lastTime: "Nov-23" }, { user: "Mai Huu Nghia", message: "Hi, please review my CV", lastTime: "Now" }]

const CompanyMessage: React.FC = () => {
    return (
        <>
            <CompanyAppBar />
            <Grid container spacing={2} className='bg-[#f3f2f0] min-h-screen' sx={{mt:0}}>
                <Grid item xs={3} className='border-r-4 m-8'>
                    {recentMessages.map((message) => (
                        <>
                            <ListItemButton
                                key={message.user}
                                className='bg-white'
                            >
                                <div className="w-12 h-12 rounded-full overflow-hidden mr-3">
                                    <img src="https://img.freepik.com/premium-photo/happy-young-students-studying-college-library-with-stack-books_21730-4486.jpg" alt="Your Image" className="w-full h-full object-cover" />
                                </div>
                                <ListItemText
                                    primary={message.user}
                                    primaryTypographyProps={{ fontSize: 14, fontWeight: 'medium' }}
                                    secondary={message.lastTime + "  ·  " + message.message}
                                    secondaryTypographyProps={{ fontSize: 12, fontWeight: 'light' }}
                                />
                            </ListItemButton>
                            <Divider />
                        </>
                    ))}
                </Grid>
                <Grid item xs={9}>
                    <ChatHistory />
                </Grid>
            </Grid>
        </>

    );
};


export default CompanyMessage;