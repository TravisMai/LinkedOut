import React from 'react';
import { ListItemText, Divider, Grid, ListItemButton, } from '@mui/material';
import ChatHistory from './chatHistory.component';

const recentMessages = [{ user: "Byzocu", message: "Hi, please reply to me", lastTime: "Nov-23" }, { user: "New American Bible - NAB", message: "Hi, please apply to this job", lastTime: "Now" }]

const StudentMessage: React.FC = () => {
    return (
        <Grid container spacing={2} className='bg-[#f3f2f0] min-h-screen'>
            <Grid item xs={3} className='border-r-4 m-8'>
                {recentMessages.map((message) => (
                    <>
                    <ListItemButton
                        key={message.user}
                        className='bg-white'
                    >
                        <div className="w-12 h-12 rounded-full overflow-hidden mr-3">
                            <img src="https://mir-s3-cdn-cf.behance.net/project_modules/hd/46190b63764575.5abb892616e9e.jpg" alt="Your Image" className="w-full h-full object-cover" /> 
                        </div>
                        <ListItemText
                            primary={message.user}
                            primaryTypographyProps={{ fontSize: 14, fontWeight: 'medium' }}
                            secondary={message.lastTime + "  ·  " + message.message}
                            secondaryTypographyProps={{ fontSize: 12, fontWeight: 'light' }}
                        />
                    </ListItemButton>
                    <Divider/>
                    </>
                ))}
            </Grid>
            <Grid item xs={9}>
                <ChatHistory/>
            </Grid>
        </Grid>

    );
};


export default StudentMessage;