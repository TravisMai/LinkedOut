import { ContactEmergency } from "@mui/icons-material";
import { Container, IconButton, List, ListItem, ListItemText, Paper, Typography } from "@mui/material"

const messages = [{ id: 1, text: 'Hello', user: 'Tran Tri Dat' }, { id: 2, text: 'Hi', user: 'Me' }, { id: 3, text: 'I want to apply to Fullstack Developer Intern position, can you show Tran Tri Dat the applying procees?', user: 'Tran Tri Dat' }, { id: 4, text: 'Sure, please fill in this form.', user: 'Me' }, { id: 4, text: 'https://youcannotapply.Me.kintone.com', user: 'Me' }, { id: 3, text: 'Thanks! Can I have the JD of this position?', user: 'Tran Tri Dat' }, { id: 2, text: 'Yes, sure.', user: 'Me' },]

const ChatHistory: React.FC = () => {
    return (
        <>
            {/* Chat History */}
            <Container className='flex flex-col h-fit'>
                <Paper className='flex mt-6'>
                    <div className="w-12 h-12 rounded-full overflow-hidden m-4">
                        <img src="https://img.freepik.com/premium-photo/happy-young-students-studying-college-library-with-stack-books_21730-4486.jpg" alt="Your Image" className="w-full h-full object-cover" />
                    </div>
                    <Typography variant='h5' className='py-6'>Tran Tri Dat</Typography>
                    <div className="mt-5 ml-3">
                        <IconButton aria-label="delete" className='h-fit' href='/company/applicant/a3c42848-b721-4320-8853-cf8f33caccef'>
                            <ContactEmergency />
                        </IconButton>
                    </div>
                </Paper>
                <Paper className='flex-grow mt-2'>
                    <List>
                        {messages.map((message) => (
                            <ListItem key={message.id}>
                                <ListItemText
                                    primary={message.user}
                                    secondary={message.text}
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