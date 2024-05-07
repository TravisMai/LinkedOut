import { Check, Search } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { Container, Grid, Link, List, ListItem, ListItemIcon, ListItemText, Typography } from '@mui/material';
import { Box } from '@mui/system';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import CompanyAppBar from './CompanyAppBar.component';
import { getJwtToken } from '../../shared/utils/authUtils';


const JobDisplayCompany: React.FC = () => {
    const { jobId } = useParams();
    const [job, setJob] = useState<jobType>();
    const [companyJobs, setCompanyJobs] = useState<jobType[]>([]);
    const [loading, setLoading] = React.useState(false);
    const [isActive, setIsActive] = useState<boolean>(false);


    const token = getJwtToken();

    // Fetch company's jobs
    useQuery({
        queryKey: "companyJobs23",
        queryFn: () => axios.get("https://linkedout-hcmut.feedme.io.vn/api/v1/job/company", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }),
        onSuccess: (data) => {
            setCompanyJobs(data.data);
        }
    });

    // Get job with match id from company jobs
    React.useEffect(() => {
        const selectedJob = companyJobs.find((job) => job.id === jobId);
        if (selectedJob) {
            setJob(selectedJob);
        }
    }, [companyJobs]);


    function handleOpenJob() {
        setLoading(true);
        // set isActive of formData to true
        const updatedFormData = { ...formData, isActive: true };
        setTimeout(() => {
            mutation.mutate(updatedFormData);
        }, 1000);
    }

    function handleCloseJob() {
        setLoading(true);
        // set isActive to false
        const updatedFormData = { ...formData, isActive: false };
        setTimeout(() => {
            mutation.mutate(updatedFormData);
        }, 1000);
    }


    // Handle update job
    interface updateForm {
        title: string | undefined,
        isActive: boolean | undefined,
        workType: string | undefined,
        quantity: number | undefined,
    }

    const [formData, setFormData] = useState<updateForm>({
        title: '',
        isActive: false,
        workType: '',
        quantity: 0,
    });


    useEffect(() => {
        if (job) {
            setFormData({
                title: job.title,
                isActive: job.isActive,
                workType: job.workType,
                quantity: job.quantity,
            });
            setIsActive(job.isActive);
        };
    }, [job]);



    const mutation = useMutation<ResponseType, ErrorType, updateForm>({
        mutationFn: (formData) => {
            return axios.put(`https://linkedout-hcmut.feedme.io.vn/api/v1/job/${jobId}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
        },
        onSuccess: (data) => {
            setLoading(false);
            setIsActive(!isActive);
        },
        onError: () => {
            console.log(mutation.error);
            setLoading(false);
        },
        onMutate: () => {
            setLoading(true);
        }
    }
    );


    return (
        <>
            <CompanyAppBar />

            <Container>
                <Grid container spacing={2} sx={{ mt: 3 }}>
                    <Grid item xs={7}>
                        <Box display="flex" gap={3}>
                            <Typography variant="h4">{job?.title}</Typography>
                            {isActive ?
                                <LoadingButton variant="outlined" color="error" onClick={handleCloseJob} loading={loading}>Job is Open, Click to Close Job</LoadingButton>
                                :
                                <>
                                    <LoadingButton variant="outlined" color="success" onClick={handleOpenJob} loading={loading}>Job is Closed, Click to Open Job</LoadingButton>

                                </>
                            }
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
                                <ListItemText primary={job?.descriptions?.aboutUs}></ListItemText>
                            </ListItem>
                        </List>
                        {job?.workType === "Internship" ? <>
                            <Typography variant="h6">Internship Program</Typography>
                            <List sx={{ mb: 2 }}>
                                <ListItem>
                                    <Link> <ListItemText primary={job?.title + " INTERNSHIP PROGRAM"}></ListItemText></Link>
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
                            {job?.descriptions?.responsibilities.map((responsibility) => (
                                <ListItem>
                                    <ListItemIcon><Search /></ListItemIcon>
                                    <ListItemText primary={responsibility}></ListItemText>
                                </ListItem>
                            ))}
                        </List>
                        <Typography variant="h6">Requirements</Typography>
                        <List sx={{ mb: 2 }}>
                            {job?.descriptions?.requirements.map((requirement) => (
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