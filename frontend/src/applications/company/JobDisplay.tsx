import { Apartment, Check, Close, Email, Event, Search, Work } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { Button, Container, Grid, Link, List, ListItem, ListItemIcon, ListItemText, Typography } from '@mui/material';
import { Box } from '@mui/system';
import axios from 'axios';
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import CompanyAppBar from './CompanyAppBar.component';

const usingtoken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjFhZTZjYWEzLTAwNTgtNDg3My05NjQxLTFiOGQxMWYwNGZlNCIsInVzZXJuYW1lIjoic3RhZmYgMDAwMSIsImVtYWlsIjoic3RhZmYyQGhjbXV0LmVkdS52biIsInJvbGUiOiJzdGFmZiIsImlhdCI6MTY5NTc5NDE4NSwiZXhwIjoxNzI3MzUxNzg1fQ.bhG0pDXwTSGQ2iOSj8WN7IdP642uc6kFTAPlfeLBWMU";

type jobType = {
    "id": string,
    "company": {
        "id": string,
        "name": string,
        "email": string,
        "avatar": string,
        "workField": string,
        "address": string,
    },
    "title": string,
    "image": null,
    "salary": null,
    "level": string,
    "workType": string,
    "quantity": number,
    "descriptions": {
        "aboutUs": string,
        "responsibilities": [string],
        "requirements": [string],
    }
}

const JobDisplayCompany: React.FC = () => {
    const { jobId } = useParams();
    const [job, setJob] = useState<jobType>();


    const token = usingtoken;

    // Fetch all jobs
    useQuery({
        queryKey: "allJobs",
        queryFn: () => axios.get("http://52.163.112.173:4000/api/v1/job/" + jobId, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }),
        onSuccess: (data) => {
            console.log(data.data);
            setJob(data.data);
        }
    });

    const [loading, setLoading] = React.useState(false);
    const [applied, setApplied] = React.useState(false);

    function handleClick() {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            !applied ? setApplied(true) : setApplied(false);
        }, 2000);
    }

    return (
        <>
            <CompanyAppBar />

            <Container>
                <Grid container spacing={2} sx={{ mt: 3 }}>
                    <Grid item xs={7}>
                        <Box display="flex" gap={3}>
                            <Typography variant="h4">{job?.title}</Typography>
                            <LoadingButton variant="outlined" color="error" onClick={handleClick} loading={loading}>{!applied ? "Close" : <Close/>}</LoadingButton>
                            {job?.workType === "Internship" ? <Button variant="outlined" color="success" href='/company/applicant'>View applicants</Button> : null}
                        </Box>
                        <Typography variant="h5" sx={{ my: 2, fontStyle: 'italic' }}>{job?.workType}</Typography>
                        <Box display="flex" width={4 / 5} justifyContent="space-evenly" sx={{ mb: 3, border: 1, borderRadius: 3 }}>
                            <Box display="flex" flexDirection="column" alignItems="center">
                                <Typography variant="h5">Open Date</Typography>
                                <Typography variant="h6">16/11/2023</Typography>
                            </Box>
                            <Box display="flex" flexDirection="column" alignItems="center">
                                <Typography variant="h5">Close Date</Typography>
                                <Typography variant="h6">16/01/2024</Typography>
                            </Box>

                        </Box>
                        <Typography variant="h6">Description</Typography>
                        <List sx={{ mb: 2 }}>
                            <ListItem>
                                <ListItemText primary={job?.descriptions.aboutUs}></ListItemText>
                            </ListItem>
                        </List>
                        {job?.workType === "Internship" ? <>
                            <Typography variant="h6">Internship Program</Typography>
                            <List sx={{ mb: 2 }}>
                                <ListItem>
                                    <Link> <ListItemText primary={job?.company.name + " INTERNSHIP PROGRAM"}></ListItemText></Link>
                                </ListItem>
                            </List>

                            <Typography variant="h6">Quantity</Typography>
                            <List sx={{ mb: 2 }}>
                                <ListItem>
                                    <ListItemText primary="Required" secondary={job?.quantity}></ListItemText>
                                    <ListItemText primary="Registered" secondary={job?.quantity}></ListItemText>
                                    <ListItemText primary="Accepted" secondary={job?.quantity}></ListItemText>
                                    <ListItemText primary="Max Accept" secondary={job?.quantity}></ListItemText>

                                </ListItem>
                            </List>
                        </>
                            : null}
                        <Typography variant="h6">Responsibities</Typography>
                        <List sx={{ mb: 2 }}>
                            {job?.descriptions.responsibilities.map((responsibility) => (
                                <ListItem>
                                    <ListItemIcon><Search /></ListItemIcon>
                                    <ListItemText primary={responsibility}></ListItemText>
                                </ListItem>
                            ))}
                        </List>
                        <Typography variant="h6">Requirements</Typography>
                        <List sx={{ mb: 2 }}>
                            {job?.descriptions.requirements.map((requirement) => (
                                <ListItem>
                                    <ListItemIcon><Check /></ListItemIcon>
                                    <ListItemText primary={requirement}></ListItemText>
                                </ListItem>
                            ))}
                        </List>
                        <Typography variant="h6">Level</Typography>
                        <List sx={{ mb: 2 }}>
                            <ListItem>
                                <ListItemText primary={job?.level}></ListItemText>
                            </ListItem>
                        </List>

                        <Typography variant="h6">Salary</Typography>
                        <List sx={{ mb: 2 }}>
                            <ListItem>
                                <ListItemText primary={job?.salary ? job.salary : "None"}></ListItemText>
                            </ListItem>
                        </List>

                    </Grid>
                    <Grid item xs={4}>

                        <Typography variant="h6">APPLIED STUDENTS</Typography>

                        <List>
                            <ListItem>
                                <ListItemIcon><img
                                    src="https://img.freepik.com/premium-photo/happy-young-students-studying-college-library-with-stack-books_21730-4486.jpg"
                                    className='w-10 h-10 object-cover rounded-full border-2 border-gray-200 mb-2'
                                    alt="company avatar"
                                /></ListItemIcon>
                                <ListItemText primary="Tran Tri Dat" secondary="Applied 10/10/2023"></ListItemText>

                            </ListItem>
                            
                        </List>

                    </Grid>

                </Grid>



            </Container >
        </>
    );
};

export default JobDisplayCompany;