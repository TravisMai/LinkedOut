import { Check, LockOutlined, Search } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { CardActionArea, Container, Grid, Link, List, ListItem, ListItemIcon, ListItemText, Typography } from '@mui/material';
import { Box } from '@mui/system';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import CompanyAppBar from '../CompanyAppBar.component';
import { getJwtToken } from '../../../shared/utils/authUtils';
import UpdateDialog from './UpdateDialog.component';
import DeleteDialog from './DeleteDialog.component';


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
    }, [companyJobs, jobId]);


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

    // Handle open/close job
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
        }
    }, [jobId, job]);

    const mutation = useMutation<ResponseType, ErrorType, updateForm>({
        mutationFn: (formData) => {
            return axios.put(`https://linkedout-hcmut.feedme.io.vn/api/v1/job/${jobId}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
        },
        onSuccess: () => {
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

    // Fetch all applicants of the job
    const [applicationList, setApplicationList] = useState<jobApplicationType[]>([]);
    const [applied, setApplied] = useState<number>(0);
    const [accepted, setAccepted] = useState<number>(0);

    useQuery({
        queryKey: "jobApplicants",
        queryFn: () => axios.get(`https://linkedout-hcmut.feedme.io.vn/api/v1/job_applicants/${jobId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }),
        onSuccess: (data) => {
            setApplicationList(data.data);
            // Count number of applied students
            setApplied(data.data.length);
            // Count number of accepted students
            setAccepted(data.data.filter((application: jobApplicationType) => application.status === "Accepted").length);
        }
    });


    // Handle update job (dialog)
    const [openDialog, setOpenDialog] = React.useState(false);
    const handleOpenDialog = () => {
        setLoading(true);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        // Force the page to reload
        window.location.reload();
    }

    const handleExit = () => {
        setLoading(false);
        setOpenDialog(false);
    }


    // Handle delete dialog

    const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);

    const handleOpenDeleteDialog = () => {
        setLoading(true);
        setOpenDeleteDialog(true);
    };


    const handleExitDelete = () => {
        setLoading(false);
        setOpenDeleteDialog(false);
    }


    return (
        <>
            <CompanyAppBar />

            <Container>
                <Grid container spacing={2} sx={{ mt: 3 }}>

                    <Grid item xs={7}>
                        <Grid container columnSpacing={2} sx={{ marginBottom: 3 }}>
                            {isActive ?
                                <Grid item xs={3}>
                                    <LoadingButton variant="contained" color="error" onClick={handleCloseJob} loading={loading}> Close Job </LoadingButton>
                                </Grid>
                                :
                                <Grid item xs={3}>
                                    <LoadingButton variant="contained" color="success" onClick={handleOpenJob} loading={loading}> Open Job </LoadingButton>
                                </Grid>
                            }
                            <Grid item xs={3}>
                                <LoadingButton variant="contained" color="primary" onClick={handleOpenDialog} loading={loading}> Update Job</LoadingButton>
                            </Grid>
                            <Grid item xs={3}>
                                <LoadingButton variant="outlined" color="error" onClick={handleOpenDeleteDialog} loading={loading}> Delete Job</LoadingButton>
                            </Grid>


                        </Grid>

                        <Box display="flex" gap={3} alignItems={"center"}>

                            <Typography variant="h4">{job?.title}</Typography>
                            {!isActive && <LockOutlined />}


                        </Box>

                        <Typography variant="h5" sx={{ my: 2, fontStyle: 'italic' }}>{job?.workType}</Typography>



                        <Box display="flex" width={4 / 5} justifyContent="space-evenly" sx={{ mb: 3, border: 1, borderRadius: 3 }}>
                            <Box display="flex" flexDirection="column" alignItems="center">
                                <Typography variant="h5">Open Date</Typography>
                                <Typography variant="h6">{job?.openDate ? job.openDate.toString().split('T')[0] : "---"}</Typography>
                            </Box>
                            <Box display="flex" flexDirection="column" alignItems="center">
                                <Typography variant="h5">Close Date</Typography>
                                <Typography variant="h6">{job?.expireDate ? job.expireDate.toString().split('T')[0] : "---"}</Typography>
                            </Box>

                        </Box>
                        {job?.descriptions?.aboutUs &&
                            <>
                                <Typography variant="h6">Description</Typography>
                                <List sx={{ mb: 2 }}>
                                    <ListItem>
                                        <ListItemText primary={job?.descriptions?.aboutUs}></ListItemText>
                                    </ListItem>
                                </List>
                            </>
                        }
                        {job?.workType === "Internship" && job?.internshipPrograme ?
                            <>
                                <Typography variant="h6">Internship Program</Typography>
                                <List sx={{ mb: 2 }}>
                                    <ListItem>
                                        <Link href={job?.internshipPrograme}> <ListItemText primary="Internship program"></ListItemText></Link>
                                    </ListItem>
                                </List>
                            </> : null
                        }
                        <Typography variant="h6">Quantity</Typography>
                        <List sx={{ mb: 2 }}>
                            <ListItem>
                                <ListItemText primary="Required" secondary={job?.quantity}></ListItemText>
                                <ListItemText primary="Registered" secondary={applied}></ListItemText>
                                <ListItemText primary="Accepted" secondary={accepted}></ListItemText>
                            </ListItem>
                        </List>
                        <Typography variant="h6">Responsibilities</Typography>
                        <List sx={{ mb: 2 }}>
                            {job?.descriptions?.responsibilities ? job?.descriptions?.responsibilities.map((responsibility, index) => (
                                <ListItem key={job?.id + "responsibility" + index}>
                                    <ListItemIcon><Search /></ListItemIcon>
                                    <ListItemText primary={responsibility}></ListItemText>
                                </ListItem>
                            )) : <></>}
                        </List>
                        <Typography variant="h6">Requirements</Typography>
                        <List sx={{ mb: 2 }}>
                            {job?.descriptions?.requirements ? job?.descriptions?.requirements.map((requirement, index) => (
                                <ListItem key={job?.id + "requirement" + index}>
                                    <ListItemIcon><Check /></ListItemIcon>
                                    <ListItemText primary={requirement}></ListItemText>
                                </ListItem>
                            )) : <></>}
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
                                <ListItemText primary={job?.salary ? "VND " + job.salary.toLocaleString('en-US') : "None"}></ListItemText>

                            </ListItem>
                        </List>

                    </Grid>
                    <Grid item xs={4}>

                        <Typography variant="h6">APPLIED STUDENTS</Typography>
                        { }
                        <List>
                            {applicationList.length ? applicationList.map((application, index) => (
                                <CardActionArea href={`../applicant/${application.id}`} key={application.id + index}>
                                    <ListItem >
                                        <ListItemIcon><img
                                            src={application.student.avatar}
                                            className='w-10 h-10 object-cover rounded-full border-2 border-gray-200 mb-2'
                                            alt="company avatar"
                                        /></ListItemIcon>
                                        <ListItemText primary={application.student.name} secondary={application.status + " " + application.updated.toString().split("T")[0]} ></ListItemText>
                                    </ListItem>
                                </CardActionArea>
                            )) : "No application yet"}
                            {/* <ListItem>
                                <ListItemIcon><img
                                    src="https://img.freepik.com/premium-photo/happy-young-students-studying-college-library-with-stack-books_21730-4486.jpg"
                                    className='w-10 h-10 object-cover rounded-full border-2 border-gray-200 mb-2'
                                    alt="company avatar"
                                /></ListItemIcon>
                                <ListItemText primary="Tran Tri Dat" secondary="Applied 10/10/2023"></ListItemText>

                            </ListItem> */}

                        </List>

                    </Grid>

                </Grid>

                <UpdateDialog jobId={jobId || ''} state={openDialog} onExit={handleExit} onClose={handleCloseDialog} />
                <DeleteDialog jobId={jobId || ''} state={openDeleteDialog} onExit={handleExitDelete} />

            </Container >
        </>
    );
};

export default JobDisplayCompany;