import { Apartment, Check, Email, Event, Search, Work } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { Button, Container, Grid, Link, List, ListItem, ListItemIcon, ListItemText, Typography } from '@mui/material';
import { Box } from '@mui/system';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import { getJwtToken } from '../../../../shared/utils/authUtils';


const JobDisplay: React.FC = () => {
    const { jobId } = useParams();
    const [job, setJob] = useState<jobType>();

    // Get jwt token
    const token = getJwtToken();

    // Fetch all jobs
    useQuery({
        queryKey: "thisJob",
        queryFn: () => axios.get("http://localhost:4000/api/v1/job/" + jobId, {
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

    // Get Student information
    const [studentData, setStudentData] = React.useState<studentType>([]);
    const getStudentInfo = useQuery({
        queryKey: "studentInfo",
        queryFn: () => axios.get("http://localhost:4000/api/v1/student/me", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
    });
    useEffect(() => {
        if (getStudentInfo.isSuccess) {
            setStudentData(getStudentInfo.data.data);
        }
    }, [getStudentInfo.isSuccess]);


    return (
        <Container>
            <Grid container spacing={2} sx={{ mt: 3 }}>
                <Grid item xs={7}>
                    <Box display="flex" gap={3}>
                        <Typography variant="h4">{job?.title}</Typography>
                        <LoadingButton variant="outlined" color="primary" onClick={handleClick} loading={loading} disabled={!studentData.isVerify}>{!applied ? "Apply" : <Check />}</LoadingButton>
                        {job?.workType === "Internship" ? <Button variant="outlined" color="success" disabled={!studentData.isVerify}>Apply Intern</Button> : null}
                    </Box>
                    <Typography variant="h5" sx={{ my: 2, fontStyle: 'italic' }}>{job?.workType}</Typography>
                    <Box display="flex" width={4 / 5} justifyContent="space-evenly" sx={{ mb: 3, border: 1, borderRadius: 3 }}>
                        <Box display="flex" flexDirection="column" alignItems="center">
                            <Typography variant="h5">Open Date</Typography>
                            <Typography variant="h6">{job?.expireDate.getDay}</Typography>
                        </Box>
                        <Box display="flex" flexDirection="column" alignItems="center">
                            <Typography variant="h5">Close Date</Typography>
                            <Typography variant="h6">{job?.expireDate}</Typography>
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
                                <Link href={job?.internshipPrograme}> <ListItemText primary={job?.company.name + " INTERNSHIP PROGRAM"}></ListItemText></Link>
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
                    <img
                        src={job?.company.avatar}
                        className='w-full object-cover rounded-xl border-2 border-gray-200 mb-2'
                        alt="company avatar"
                    />
                    <Typography variant="h6">{job?.company.name}</Typography>

                    <List>
                        <Typography variant="h6">Work Field</Typography>
                        <ListItem>
                            <ListItemIcon><Work /></ListItemIcon>
                            <ListItemText primary={job?.company.workField}></ListItemText>

                        </ListItem>
                        <Typography variant="h6">Address</Typography>
                        <ListItem>
                            <ListItemIcon><Apartment /></ListItemIcon>
                            <ListItemText primary={job?.company.address}></ListItemText>

                        </ListItem>
                        <Typography variant="h6">Contact</Typography>
                        <ListItem>
                            <ListItemIcon><Email /></ListItemIcon>
                            <ListItemText primary={job?.company.email}></ListItemText>
                        </ListItem>
                    </List>

                </Grid>

            </Grid>



        </Container >
    );
};

export default JobDisplay;