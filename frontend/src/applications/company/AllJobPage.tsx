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
import { useState } from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import CompanyAppBar from './CompanyAppBar.component';
import { Typography } from '@mui/material';
import { Add, Launch, RecentActors } from '@mui/icons-material';
import { getJwtToken } from '../../shared/utils/authUtils';

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



export function AllJobPage() {

    const [allCompany, setAllCompany] = useState<companyType[]>([]);

    const token = getJwtToken();

    // Fetch all companies
    useQuery({
        queryKey: "allJobs",
        queryFn: () => axios.get("http://52.163.112.173:4000/api/v1/job/", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }),
        onSuccess: (data) => {
            setAllCompany(data.data);
        }
    });

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
                All jobs
            </Typography>
            <div className='mt-8 w-5/6 mx-auto'>
                <div className='flex flex-row space-x-2'>
                    <TextField
                        id="search"
                        type="search"
                        label="Search"
                        value={searchTerm}
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
                    <Button variant="outlined" color='success' sx={{}} href='/company/jobs/add'><Add />Add</Button>
                </div>
                <TableContainer component={Paper} className='mt-5'>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell align='center'>No.</TableCell>
                                <TableCell align="center">Title</TableCell>
                                <TableCell align="center">Description</TableCell>
                                <TableCell align="center">Close day</TableCell>
                                <TableCell align="center">Applied</TableCell>
                                <TableCell align="center">Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {allCompany.length > 0 ? (
                                allCompany.map((row, index) => (
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
                                        <TableCell align="center">{row.name}</TableCell>
                                        <TableCell align="center">{row.description}</TableCell>
                                        <TableCell align="center">21/12/2023</TableCell>
                                        <TableCell align="center">9</TableCell>
                                        <TableCell align="center">
                                            <Box sx={{ '& > :not(style)': { m: 0.1 } }}>
                                                <IconButton href={'/company/applicant/'}><RecentActors /></IconButton>
                                                <IconButton href={'/company/jobs/' + row.id}><Launch /></IconButton>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))) : <></>}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </>
    );
}