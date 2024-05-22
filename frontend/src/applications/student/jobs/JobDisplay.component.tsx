import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import { Container, Divider, IconButton, Pagination, Stack, Typography } from '@mui/material';
import { getJwtToken } from '../../../shared/utils/authUtils';
import { OpenInNew } from '@mui/icons-material';

const JobDisplay: React.FC = () => {
   
    // Get jwt token

    const token = getJwtToken();

    // Get Student information
    const [studentData, setStudentData] = React.useState<studentType>();
    const getStudentInfo = useQuery({
        queryKey: "studentInfo",
        queryFn: () => axios.get("https://linkedout-hcmut.feedme.io.vn/api/v1/student/me", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
    });
    useEffect(() => {
        if (getStudentInfo.isSuccess) {
            setStudentData(getStudentInfo.data.data);
            // console.log(getStudentInfo.data.data.id)
        }
    }, [getStudentInfo.isSuccess, getStudentInfo.data?.data]);

    useEffect(() => {
        if (getStudentInfo.isSuccess && getStudentInfo.data.data.id) {
            setStudentData(getStudentInfo.data.data);
        }
    }, [getStudentInfo.isSuccess, getStudentInfo.data?.data]);


    // Get all applied jobs
    const [appliedJobs, setAppliedJobs] = React.useState<jobApplicationType[]>([]);
    const fetchAppliedJobs = (studentId: string) => {
        axios.get(`https://linkedout-hcmut.feedme.io.vn/api/v1/job_applicants/candidate/${studentId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(response => {
                console.log(response.data);
                setAppliedJobs(response.data);
            })
            .catch(error => {
                console.error("Error fetching applied jobs:", error);
            });
    };

    useEffect(() => {
        if (studentData && studentData.id) {
            fetchAppliedJobs(studentData.id);
        }
    }, [studentData, fetchAppliedJobs]);

    // Get all job with status
    const appliedList = appliedJobs.filter((job: jobApplicationType) => job.status === 'Applied');
    const approvedList = appliedJobs.filter((job: jobApplicationType) => job.status === 'Approved');
    const pendingList = appliedJobs.filter((job: jobApplicationType) => job.status === 'Processing');
    const rejectedList = appliedJobs.filter((job: jobApplicationType) => job.status === 'Rejected');





    // Handle pagination
    const itemsPerPage = 2; // Number of items per page

    // State variables for pagination
    const [currentPageApplied, setCurrentPageApplied] = useState(0);
    const [currentPageApproved, setCurrentPageApproved] = useState(0);
    const [currentPagePending, setCurrentPagePending] = useState(0);
    const [currentPageRejected, setCurrentPageRejected] = useState(0);

    // Handle page change
    const handlePageChange = (value: number, page: string) => {
        if (page === 'applied') setCurrentPageApplied(value);
        if (page === 'approved') setCurrentPageApproved(value);
        if (page === 'pending') setCurrentPagePending(value);
        if (page === 'rejected') setCurrentPageRejected(value);
    };

    // Limit display jobs
    const limitedAppliedJobs = appliedList.slice(itemsPerPage * currentPageApplied, itemsPerPage * currentPageApplied + itemsPerPage);
    const limitedApprovedJobs = approvedList.slice(itemsPerPage * currentPageApproved, itemsPerPage * currentPageApproved + itemsPerPage);
    const limitedPendingJobs = pendingList.slice(itemsPerPage * currentPagePending, itemsPerPage * currentPagePending + itemsPerPage);
    const limitedRejectedJobs = rejectedList.slice(itemsPerPage * currentPageRejected, itemsPerPage * currentPageRejected + itemsPerPage);

    return (
        <div className="mt-6 w-full h-fit flex flex-col space-y-6 px-5 pb-10">
            {/* Applied jobs */}
            <Container className='h-fit bg-white rounded-xl pb-2'>
                <Typography variant='h5' className='pt-4'>Applied Jobs</Typography>
                <Typography variant='caption'>Jobs that you have applied</Typography>
                {appliedList.length > 0 ? (
                    limitedAppliedJobs.map((application: jobApplicationType) => (
                        <>
                            <div className='flex flex-row mt-5 mb-3'>
                                <div className='mr-4 basis-1/12 center'>
                                    <img
                                        src={application.job.company.avatar}
                                        className='w-full h-3/4 object-cover rounded-xl'
                                        alt="company avatar" />
                                </div>
                                <div className='basis-11/12'>

                                    <Typography variant="h5" >
                                        {application.job.title}
                                    </Typography>
                                    <Typography variant='body2' color="text.secondary">
                                        {application.job.company.name}
                                    </Typography>
                                    <Typography variant='body2' color="text.secondary">
                                        {application.job?.descriptions?.aboutUs ?? ""}
                                    </Typography>

                                </div>
                                <IconButton aria-label="delete" className='h-fit' href={'/student/jobs/' + application.job.id}>
                                    <OpenInNew />
                                </IconButton>
                            </div>
                            <Divider />
                        </>
                    ))
                ) : (
                    <p>No applied job</p>
                )}
                {appliedList.length > 0 &&
                    <div className='w-full mt-2 flex justify-center '>
                        <Stack spacing={2} >
                            <Pagination
                                count={Math.ceil(appliedList.length / itemsPerPage)}
                                onChange={(_event, value) => handlePageChange(value - 1, 'applied')}
                            />
                        </Stack>
                    </div>
                }
            </Container>

            {/* Approved jobs */}
            <Container className='h-fit bg-white rounded-xl pb-2' >
                <Typography variant='h5' className='pt-4'>Approved Jobs</Typography>
                <Typography variant='caption'>Jobs that you have qualified</Typography>
                {approvedList.length > 0 ? (
                    limitedApprovedJobs.map((application: jobApplicationType) => (
                        <>
                            <div className='flex flex-row mt-5 mb-3'>
                                <div className='mr-4 basis-1/12 center'>
                                    <img
                                        src={application.job.company.avatar}
                                        className='w-full h-3/4 object-cover rounded-xl'
                                        alt="company avatar" />
                                </div>
                                <div className='basis-11/12'>

                                    <Typography variant="h5" >
                                        {application.job.title}
                                    </Typography>
                                    <Typography variant='body2' color="text.secondary">
                                        {application.job.company.name}
                                    </Typography>
                                    <Typography variant='body2' color="text.secondary">
                                        {application.job?.descriptions?.aboutUs ?? ""}
                                    </Typography>

                                </div>
                                <IconButton aria-label="delete" className='h-fit' href={'/student/jobs/' + application.job.id}>
                                    <OpenInNew />
                                </IconButton>
                            </div>
                            <Divider />

                        </>
                    ))
                ) : (
                    <p>No approved job</p>
                )}
                {approvedList.length > 0 &&
                    <div className='w-full mt-2 flex justify-center '>
                        <Stack spacing={2} >
                            <Pagination
                                count={Math.ceil(approvedList.length / itemsPerPage)}
                                onChange={(_event, value) => handlePageChange(value - 1, 'approved')}
                            />
                        </Stack>
                    </div>
                }

            </Container>

            {/* Pending jobs */}
            <Container className='h-fit bg-white rounded-xl pb-2'>
                <Typography variant='h5' className='pt-4'>Processing Jobs</Typography>
                <Typography variant='caption'>Jobs that processing</Typography>
                {pendingList.length > 0 ? (
                    limitedPendingJobs.map((application: jobApplicationType) => (
                        <>
                            <div className='flex flex-row mt-5 mb-3'>
                                <div className='mr-4 basis-1/12 center'>
                                    <img
                                        src={application.job.company.avatar}
                                        className='w-full h-3/4 object-cover rounded-xl'
                                        alt="company avatar" />
                                </div>
                                <div className='basis-11/12'>

                                    <Typography variant="h5" >
                                        {application.job.title}
                                    </Typography>
                                    <Typography variant='body2' color="text.secondary">
                                        {application.job.company.name}
                                    </Typography>
                                    <Typography variant='body2' color="text.secondary">
                                        {application.job?.descriptions?.aboutUs ?? ""}
                                    </Typography>

                                </div>
                                <IconButton aria-label="delete" className='h-fit' href={'/student/jobs/' + application.job.id}>
                                    <OpenInNew />
                                </IconButton>
                            </div>
                            <Divider />
                        </>
                    ))
                ) : (
                    <p>No pricessing job</p>
                )}
                {pendingList.length > 0 &&
                    <div className='w-full mt-2 flex justify-center '>
                        <Stack spacing={2} >
                            <Pagination
                                count={Math.ceil(pendingList.length / itemsPerPage)}
                                onChange={(_event, value) => handlePageChange(value - 1, 'pending')}
                            />
                        </Stack>
                    </div>
                }
            </Container>

            {/* Rejected jobs */}
            <Container className='h-fit bg-white rounded-xl pb-2'>
                <Typography variant='h5' className='pt-4'>Rejected Jobs</Typography>
                <Typography variant='caption'>Jobs that rejected</Typography>
                {rejectedList.length > 0 ? (
                    limitedRejectedJobs.map((application: jobApplicationType) => (
                        <>
                            <div className='flex flex-row mt-5 mb-3'>
                                <div className='mr-4 basis-1/12 center'>
                                    <img
                                        src={application.job.company.avatar}
                                        className='w-full h-3/4 object-cover rounded-xl'
                                        alt="company avatar" />
                                </div>
                                <div className='basis-11/12'>

                                    <Typography variant="h5" >
                                        {application.job.title}
                                    </Typography>
                                    <Typography variant='body2' color="text.secondary">
                                        {application.job.company.name}
                                    </Typography>
                                    <Typography variant='body2' color="text.secondary">
                                        {application.job?.descriptions?.aboutUs ?? ""}
                                    </Typography>

                                </div>
                                <IconButton aria-label="delete" className='h-fit' href={'/student/jobs/' + application.job.id}>
                                    <OpenInNew />
                                </IconButton>
                            </div>
                            <Divider />
                        </>
                    ))
                ) : (
                    <p>No rejected job</p>
                )}
                {rejectedList.length > 0 &&
                    <div className='w-full mt-2 flex justify-center '>
                        <Stack spacing={2} >
                            <Pagination
                                count={Math.ceil(rejectedList.length / itemsPerPage)}
                                onChange={(_event, value) => handlePageChange(value - 1, 'rejected')}
                            />
                        </Stack>
                    </div>
                }
            </Container>
        </div>
    );
};

export default JobDisplay;
