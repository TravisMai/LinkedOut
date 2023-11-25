import { MoreHoriz } from "@mui/icons-material";
import { Container, IconButton, List, ListItem, ListItemText, Paper, Typography } from "@mui/material"

const messages = [{ id: 1, text: 'Hello', user: 'Me' }, { id: 2, text: 'Hi', user: 'Cybuzo' }, { id: 3, text: 'I want to apply to Fullstack Developer Intern position, can you show me the applying procees?', user: 'Me' }, { id: 4, text: 'Sure, please fill in this form.', user: 'Cybuzo' }, { id: 4, text: 'https://youcannotapply.cybuzo.kintone.com', user: 'Cybuzo' }, { id: 3, text: 'Thanks! Can I have the JD of this position?', user: 'Me' }, { id: 2, text: 'Yes, sure.', user: 'Cybuzo' },]

const ChatHistory: React.FC = () => {
    return (
        <>
            {/* Chat History */}
            <Container className='flex flex-col h-fit'>
                <Paper className='flex mt-6'>
                    <div className="w-12 h-12 rounded-full overflow-hidden m-4">
                        <img src="https://mir-s3-cdn-cf.behance.net/project_modules/hd/46190b63764575.5abb892616e9e.jpg" alt="Your Image" className="w-full h-full object-cover" />
                    </div>
                    <Typography variant='h5' className='py-6'>Cybuzo</Typography>
                    <div className="mt-5 ml-3">
                        <IconButton aria-label="delete" className='h-fit'>
                            <MoreHoriz />
                        </IconButton>
                    </div>
                </Paper>
                <Paper className='flex-grow mt-2'>
                    <List>
                        {messages.map((message) => (
                            <ListItem key={message.id}>
                                <ListItemText
                                    primary={message.text}
                                    secondary={"- " + message.user}
                                />
                            </ListItem>
                        ))}
                    </List>
                </Paper>
                {/* Chat Input and send button */}
                <Paper className='flex mt-6'>
                    <input className='flex-grow p-2' placeholder='Type your message here...' />
                    <button className='p-2 bg-[#f3f2f0]'>Send</button>
                </Paper>

            </Container>

        </>
    );
};

export default ChatHistory;