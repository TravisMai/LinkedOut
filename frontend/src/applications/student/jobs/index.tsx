import React from 'react';
import { Grid} from '@mui/material';
import LeftSidebar from './LeftSidebar.component';
import JobDisplay from './JobDisplay.component';
import RightSidebar from './RightSidebar.component';

const StudentJobsPage: React.FC = () => {

    return (
        <Grid container spacing={2} className='bg-[#f3f2f0] min-h-screen'>
            <Grid item xs={2}>
                <LeftSidebar/>
            </Grid>
            <Grid item xs={6}>
                <JobDisplay/>
            </Grid>
            <Grid item xs={4}>
                <RightSidebar/>
            </Grid>
        </Grid>

    );
};

export default StudentJobsPage;
