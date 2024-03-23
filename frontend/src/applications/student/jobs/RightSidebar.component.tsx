import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { Container, Divider, Grid, IconButton, Link, List, ListItem, ListItemButton, ListItemText, Stack, Typography } from '@mui/material';
import MoreHoriz from '@mui/icons-material/MoreHoriz';
import { getJwtToken } from '../../../shared/utils/authUtils';

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

const RightSidebar: React.FC = () => {
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


    return (
        <div className="pr-5 mx-auto mt-6 pb-6 h-fit lg:min-h-[500px] flex flex-col rounded-xl space-y-2">

            <div className='flex flex-col bg-white rounded-lg items-center'>
                <Typography variant='h5' className='pt-4 text-center'>Discover more jobs</Typography>
                <List className='w-11/12 justify-center'>
                    {appliedJobs.length > 0 ? (
                        appliedJobs.map((job: jobType) => (
                            <>

                                <ListItemButton className='rounded-xl' href={'/student/jobs/'+ job.id} >
                                    <Grid container spacing={1}>
                                        <Grid item xs={2}>
                                            <img
                                                src={"/src/shared/assets/" + job.company.avatar}
                                                className='w-fit h-fit'
                                                alt="company avatar" />
                                        </Grid>
                                        <Grid item xs={10}>

                                            <Typography variant="body1" >
                                                {job.title}
                                            </Typography>
                                            <Typography variant='body2' color="text.secondary">
                                                {job.company.name}
                                            </Typography>

                                        </Grid>
                                    </Grid>
                                </ListItemButton>
                            </>
                        ))
                    ) : (
                        <p>Loading...</p>
                    )}
                    
                </List>
            </div>
        </div>
    );
};

export default RightSidebar;
