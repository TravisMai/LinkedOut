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
import CompanyAppBar from '../CompanyAppBar.component';
import { Pagination, Stack, Typography } from '@mui/material';
import { Add, Launch } from '@mui/icons-material';
import { getJwtToken } from '../../../shared/utils/authUtils';




export function AllJobPage() {

    const [companyJobs, setCompanyJobs] = useState<jobType[]>([]);

    const token = getJwtToken();

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


    // Handle pagination
    const itemsPerPage = 5;
    const [currentPage, setCurrentPage] = useState(0);

    // Handle page change
    const handlePageChange = (value: number) => {
        setCurrentPage(value);
    };

    const limitedJobs = companyJobs.slice(itemsPerPage * currentPage, itemsPerPage * currentPage + itemsPerPage);

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
                Your jobs
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
                                <TableCell align="center">Level</TableCell>
                                <TableCell align='center'>Work Type</TableCell>
                                <TableCell align="center">Close day</TableCell>
                                <TableCell align="center">Quantity</TableCell>
                                <TableCell align="center">Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {companyJobs.length > 0 ? (
                                limitedJobs.map((row, index) => (
                                    <TableRow
                                        key={row.id}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >

                                        <TableCell align='center'>{itemsPerPage * currentPage + ++index}</TableCell>
                                        {/* <TableCell align="center">
                                    <img
                                        src={row.avatar}
                                        className='h-10 mx-auto'
                                    />
                                </TableCell> */}
                                        <TableCell align="center">{row.title}</TableCell>
                                        <TableCell align="center">{row.level}</TableCell>
                                        <TableCell align="center">{row.workType}</TableCell>
                                        <TableCell align="center">{row.expireDate?.toString().split("T")[0] ?? "---"}</TableCell>
                                        <TableCell align="center">{row.quantity}</TableCell>
                                        <TableCell align="center">
                                            <Box sx={{ '& > :not(style)': { m: 0.1 } }}>
                                                <IconButton href={'/company/jobs/' + row.id}><Launch /></IconButton>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))) : <TableRow> <TableCell colSpan={6} align='center'>No job created</TableCell></TableRow>}
                        </TableBody>

                    </Table>
                </TableContainer>
                <div className='w-full mt-2 flex justify-center '>
                    <Stack spacing={2} >
                        <Pagination
                            count={Math.ceil(companyJobs.length / itemsPerPage)}
                            onChange={(_event, value) => handlePageChange(value - 1)}
                        />
                    </Stack>
                </div>
            </div>
        </>
    );
}