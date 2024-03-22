import React, { useRef, useState } from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import { Button, Container, Divider, IconButton, Link, Typography } from '@mui/material';
import MoreHoriz from '@mui/icons-material/MoreHoriz';

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

const JobDisplay: React.FC = () => {
    const mySectionRef = useRef(null);
    const [appliedJobs, setAppliedJobs] = useState<jobType[]>([]);

    // Get jwt token
    

    const token = getJwtToken();

    // Fetch all jobs
    useQuery({
        queryKey: "allJobs",
        queryFn: () => axios.get("http://localhost:4000/api/v1/job", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }),
        onSuccess: (data) => {
            console.log(data.data);
            setAppliedJobs(data.data);
        }
    });

    // Limit display jobs
    const limitedAppliedJobs = appliedJobs.slice(0, 2);

    return (
        <div className="mt-6 w-full h-fit flex flex-col space-y-3 px-5 pb-10">
            {/* Applied jobs */}
            <Container className='h-fit bg-white rounded-xl pb-2'>
                <Typography variant='h5' className='pt-4'>Applied Jobs</Typography>
                <Typography variant='caption'>Jobs that you have applied</Typography>
                {appliedJobs.length > 0 ? (
                    limitedAppliedJobs.map((job: jobType) => (
                        <>
                            <div className='flex flex-row mt-5 mb-3'>
                                <div className='mr-4 basis-1/12 center'>
                                    <img
                                        src={"/src/shared/assets/" + job.company.avatar}
                                        className='w-full h-3/4 object-cover rounded-xl'
                                        alt="company avatar" />
                                </div>
                                <div className='basis-11/12'>

                                    <Typography variant="h5" >
                                        {job.title}
                                    </Typography>
                                    <Typography variant='body2' color="text.secondary">
                                        {job.company.name}
                                    </Typography>
                                    <Typography variant='body2' color="text.secondary">
                                        {job.descriptions.aboutUs}
                                    </Typography>

                                </div>
                                <IconButton aria-label="delete" className='h-fit' href={'/student/jobs/'+ job.id}>
                                    <MoreHoriz />
                                </IconButton>
                            </div>
                            <Divider />
                        </>
                    ))
                ) : (
                    <p>Loading...</p>
                )}
                <div className='w-full mt-2'>
                    <Button variant="text" className='w-full' >Show all</Button>
                </div>
            </Container>

            {/* Approved jobs */}
            <Container className='h-fit bg-white rounded-xl pb-2' ref={mySectionRef}>
                <Typography variant='h5' className='pt-4'>Approved Jobs</Typography>
                <Typography variant='caption'>Jobs that you have qualified</Typography>
                {appliedJobs.length > 0 ? (
                    limitedAppliedJobs.map((job: jobType) => (
                        <>
                            <div className='flex flex-row mt-5 mb-3'>
                                <div className='mr-4 basis-1/12 center'>
                                    <img
                                        src={"/src/shared/assets/" + job.company.avatar}
                                        className='w-full h-3/4 object-cover rounded-xl'
                                        alt="company avatar" />
                                </div>
                                <div className='basis-11/12'>

                                    <Typography variant="h5" >
                                        {job.title}
                                    </Typography>
                                    <Typography variant='body2' color="text.secondary">
                                        {job.company.name}
                                    </Typography>
                                    <Typography variant='body2' color="text.secondary">
                                        {job.descriptions.aboutUs}
                                    </Typography>

                                </div>
                                <IconButton aria-label="delete" className='h-fit' href={'/student/jobs/'+ job.id}>
                                    <MoreHoriz />
                                </IconButton>
                            </div>
                            <Divider />
                        </>
                    ))
                ) : (
                    <p>Loading...</p>
                )}
                <div className='w-full mt-2'>
                    <Button variant="text" className='w-full' >Show all</Button>
                </div>
            </Container>

            {/* Pending jobs */}
            <Container className='h-fit bg-white rounded-xl pb-2'>
                <Typography variant='h5' className='pt-4'>Waiting Jobs</Typography>
                <Typography variant='caption'>Jobs that waiting for response</Typography>
                {appliedJobs.length > 0 ? (
                    limitedAppliedJobs.map((job: jobType) => (
                        <>
                            <div className='flex flex-row mt-5 mb-3'>
                                <div className='mr-4 basis-1/12 center'>
                                    <img
                                        src={"/src/shared/assets/" + job.company.avatar}
                                        className='w-full h-3/4 object-cover rounded-xl'
                                        alt="company avatar" />
                                </div>
                                <div className='basis-11/12'>

                                    <Typography variant="h5" >
                                        {job.title}
                                    </Typography>
                                    <Typography variant='body2' color="text.secondary">
                                        {job.company.name}
                                    </Typography>
                                    <Typography variant='body2' color="text.secondary">
                                        {job.descriptions.aboutUs}
                                    </Typography>

                                </div>
                                <IconButton aria-label="delete" className='h-fit' href={'/student/jobs/'+ job.id}>
                                    <MoreHoriz />
                                </IconButton>
                            </div>
                            <Divider />
                        </>
                    ))
                ) : (
                    <p>Loading...</p>
                )}
                <div className='w-full mt-2'>
                    <Button variant="text" className='w-full' >Show all</Button>
                </div>
            </Container>

            {/* Rejected jobs */}
            <Container className='h-fit bg-white rounded-xl pb-2'>
                <Typography variant='h5' className='pt-4'>Rejected Jobs</Typography>
                <Typography variant='caption'>Jobs that rejected</Typography>
                {appliedJobs.length > 0 ? (
                    limitedAppliedJobs.map((job: jobType) => (
                        <>
                            <div className='flex flex-row mt-5 mb-3'>
                                <div className='mr-4 basis-1/12 center'>
                                    <img
                                        src={"/src/shared/assets/" + job.company.avatar}
                                        className='w-full h-3/4 object-cover rounded-xl'
                                        alt="company avatar" />
                                </div>
                                <div className='basis-11/12'>

                                    <Typography variant="h5" >
                                        {job.title}
                                    </Typography>
                                    <Typography variant='body2' color="text.secondary">
                                        {job.company.name}
                                    </Typography>
                                    <Typography variant='body2' color="text.secondary">
                                        {job.descriptions.aboutUs}
                                    </Typography>

                                </div>
                                <IconButton aria-label="delete" className='h-fit' href={'/student/jobs/'+ job.id}>
                                    <MoreHoriz />
                                </IconButton>
                            </div>
                            <Divider />
                        </>
                    ))
                ) : (
                    <p>Loading...</p>
                )}
                <div className='w-full mt-2'>
                    <Button variant="text" className='w-full' >Show all</Button>
                </div>
            </Container>
        </div>
    );
};

export default JobDisplay;
