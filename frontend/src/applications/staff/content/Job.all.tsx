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
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { useState } from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import { getJwtToken } from '../../../shared/utils/authUtils';

export default function AllJob() {

    const [allJob, setAllJob] = useState<jobType[]>([]);

    // Get jwt token


    const token = getJwtToken();

    // Fetch all jobs
    useQuery({
        queryKey: "allJobs",
        queryFn: () => axios.get("https://linkedout-hcmut.feedme.io.vn/api/v1/job", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }),
        onSuccess: (data) => {
            console.log(data.data);
            setAllJob(data.data);
        }
    });

    const [searchTerm, setSearchTerm] = React.useState("");
    return (
        <>
            <div className='mt-8 w-full mx-auto'>
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
                </div>
                <TableContainer component={Paper} className='mt-5'>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell align='center'>No.</TableCell>
                                <TableCell align="center">Title</TableCell>
                                <TableCell align="center">Description</TableCell>
                                <TableCell align="center">Company</TableCell>
                                <TableCell align="center">Close day</TableCell>
                                <TableCell align="center">Applied</TableCell>
                                <TableCell align="center">Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {allJob.map((row, index) => (
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
                                    <TableCell align="center">{row.title}</TableCell>
                                    <TableCell align="center">{row?.descriptions?.responsibilities ?? ""}</TableCell>
                                    <TableCell align="center">{row.company.name}</TableCell>
                                    <TableCell align="center">21/12/2023</TableCell>
                                    <TableCell align="center">9</TableCell>
                                    <TableCell align="center">
                                        <Box sx={{ '& > :not(style)': { m: 0.1 } }}>
                                            <IconButton><ContactEmergencyIcon /></IconButton>
                                            <IconButton><MoreHorizIcon /></IconButton>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </>
    );
}