import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from "@mui/icons-material/Search";
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import ContactEmergencyIcon from '@mui/icons-material/ContactEmergency';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import CompanyAppBar from '../CompanyAppBar.component';
import { Typography } from '@mui/material';
import { getJwtToken } from '../../../shared/utils/authUtils';


// function createData(
//     companyId: number,
//     logoLink: string,
//     name: string,
//     representative: string,
//     phone: number,
//     email: string,
//     companyLink: string,
// ) {
//     return { companyId, logoLink, name, representative, phone, email, companyLink };
// }


export function ApplicantsPage() {

    const token = getJwtToken();


    const [companyJobs, setCompanyJobs] = useState<jobType[]>([]);

    // Fetch company's jobs
    useQuery({
        queryKey: "companyJobs",
        queryFn: () => axios.get("https://linkedout-hcmut.feedme.io.vn/api/v1/job/company", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }),
        onSuccess: (data) => {
            setCompanyJobs(data.data);
        }
    });




    const [allApplications, setAllApplications] = useState<jobApplicationType[]>([]);

    // Fetch all applications of each job when jobs are fetched
    useEffect(() => {
        setAllApplications([]);
        const fetchApplications = async () => {
            companyJobs.forEach(async (job) => {
                try {
                    const response = await axios.get(`https://linkedout-hcmut.feedme.io.vn/api/v1/job_applicants/${job.id}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    setAllApplications((prevApplications) => [...prevApplications, ...response.data]);
                } catch (error) {
                    console.error(`Error fetching applications for job ${job.id}:`, error);
                }
            });
        };

        fetchApplications();
    }, [companyJobs, token]);


    // companyJobs.map((job) => {
    //     queryKey: `allJobApplications_${job.id}`,
    //         queryFn: () => axios.get(`https://linkedout-hcmut.feedme.io.vn/api/v1/job_applicants/${job.id}`, {
    //             headers: {
    //                 Authorization: `Bearer ${token}`,
    //             },
    //         }),
    //             onSuccess: (data) => {
    //                 // Append with current applications
    //                 setAllApplications([...allApplications, ...data.data]);
    //             }
    // });
    // useQuery({

    // }, [companyJobs]);
    console.log("Fetch all applications of each job", allApplications);


    const [searchTerm, setSearchTerm] = React.useState("");
    return (
        <>
            <CompanyAppBar />
            <Typography
                component="h1"
                variant="h4"
                align="center"
                color="text.primary"
                gutterBottom
                sx={{ pt: 3 }}
            >
                Applicants
            </Typography>
            <div className='mt-8 w-5/6 mx-auto'>
                <div className='flex flex-row space-x-2'>
                    <TextField
                        id="search"
                        type="search"
                        label="Search"

                        value={searchTerm ? searchTerm : "Azure Cloud Intern"}
                        onChange={e => setSearchTerm(e.target.value)}
                        sx={{ width: 500 }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <Button variant="contained">Search</Button>
                    <Button variant="outlined">Filter</Button>
                </div>
                <TableContainer component={Paper} className='mt-5'>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell align='center'>No.</TableCell>
                                <TableCell align="center">Name</TableCell>
                                <TableCell align="center">Email</TableCell>
                                <TableCell align="center">Phone</TableCell>
                                <TableCell align="center">Applied for</TableCell>
                                <TableCell align="center">Applied on</TableCell>
                                <TableCell align="center">Status</TableCell>
                                <TableCell align="center">Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {allApplications.length > 0 ?
                                allApplications.map((row, index) => (
                                    <TableRow
                                        key={row.id}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >

                                        <TableCell align='center'>{++index}</TableCell>
                                        {/* <TableCell align="center">
                                    <img
                                        src={row.avatar}
                                        className='h-10 mx-auto'
                                    />
                                </TableCell> */}
                                        <TableCell align="center">{row.student.name}</TableCell>
                                        <TableCell align="center">{row.student.email}</TableCell>
                                        <TableCell align="center">{row.student.phoneNumber}</TableCell>
                                        <TableCell align="center">{row.job.title}</TableCell>
                                        <TableCell align="center">{row.created.toString().split('T')[0]}</TableCell>
                                        <TableCell align="center">{row.status}</TableCell>
                                        <TableCell align="center">
                                            <Box sx={{ '& > :not(style)': { m: 0.1 } }}>
                                                <IconButton href={'/company/applicant/' + row.id}><ContactEmergencyIcon /></IconButton>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                )) : <></>}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </>
    );
}