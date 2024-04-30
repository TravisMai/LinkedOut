import { Container, Grid, List, Typography } from '@mui/material';
import { Box } from '@mui/system';
import axios from 'axios';
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import { getJwtToken } from '../../../../shared/utils/authUtils';
import ContentCard from './ContentCard.component';


const CompanyDisplay: React.FC = () => {

    // Get jwt token
    const token = getJwtToken();

    const { companyId } = useParams();
    const [company, setCompany] = useState<companyType>();


    // Fetch company information
    useQuery({
        queryKey: "thisCompany",
        queryFn: () => axios.get("https://linkedout-hcmut.feedme.io.vn/api/v1/company/" + companyId, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }),
        onSuccess: (data) => {
            console.log(data.data);
            setCompany(data.data);
        }
    },

    );


    // Fetch all jobs
    const [jobs, setJobs] = useState<jobType[]>([]);
    useQuery({
        queryKey: "allJobs",
        queryFn: () => axios.get("https://linkedout-hcmut.feedme.io.vn/api/v1/job", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }),
        onSuccess: (data) => {
            console.log(data.data);
            setJobs(data.data);
        }
    });
    // Extract job of current company
    const companyJobs = jobs.filter(job => job.company.id === companyId);

    return (
        <Container>
            <Grid container columnSpacing={6} rowSpacing={2} sx={{ mt: 3 }}>
                <Grid item container direction="column" rowSpacing={3} xs={7}>
                    <Grid item>
                        <Box display="flex" gap={4} sx={{ alignItems: 'center' }}>
                            <img
                                src={company?.avatar}
                                className='w-fit max-h-32 object-cover rounded-xl border-2 border-gray-200 mb-2 '
                                alt="company avatar"
                            />
                            <Typography variant="h4" className='my-auto'>{company?.name}</Typography>

                        </Box>
                    </Grid>
                    <Grid item>
                        <Typography variant="h5">Work field</Typography>
                        {company?.workField}
                    </Grid>
                    <Grid item>
                        <Typography variant="h5">Description</Typography>
                        {company?.description}
                    </Grid>

                    <Grid item>
                        <Typography variant="h5">Email</Typography>
                        {company?.email}
                    </Grid>
                    <Grid item>
                        <Typography variant="h5">Phone number</Typography>
                        {company?.phoneNumber}
                    </Grid>
                    <Grid item>
                        <Typography variant="h5">Address</Typography>
                        {company?.address}
                    </Grid>
                    {company?.website &&
                        <Grid item>
                            <Typography variant="h5">Website</Typography>
                            {company?.website}
                        </Grid>
                    }
                    {
                        company?.taxId &&
                        <Grid item>
                            <Typography variant="h5">Tax ID</Typography>
                            {company?.taxId}
                        </Grid>
                    }

                </Grid>
                <Grid item xs={4}>
                    <Typography variant="h5">Posted jobs</Typography>
                    {/* Display if companyJobs.length >0, else display text "No posted job" */}
                    {companyJobs.length > 0 ?
                        <List>
                            {companyJobs.map((job) => (
                                <ContentCard key={job.id} job={job} />
                            ))}
                        </List>
                        :
                        <Typography>No posted job</Typography>
                    }


                </Grid>

            </Grid>
            {/* <ApplyDialog state={openDialog} onExit={handleExit} onClose={handleCloseDialog} /> */}


        </Container >
    );
};

export default CompanyDisplay;