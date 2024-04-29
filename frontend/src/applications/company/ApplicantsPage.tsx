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
import { useState } from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import CompanyAppBar from './CompanyAppBar.component';
import { Typography } from '@mui/material';
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


type studentType = {
    "id": string,
    "name": string,
    "email": string,
    "phoneNumber": string,
    "avatar": string,
    
}

export function ApplicantsPage() {

    const [allStudent, setAllStudent] = useState<studentType[]>([]);


    const token = getJwtToken();

    // Fetch all stdents
    useQuery({
        queryKey: "allStudents",
        queryFn: () => axios.get("http://52.163.112.173:4000/api/v1/student/", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }),
        onSuccess: (data) => {
            console.log(data.data);
            setAllStudent(data.data);
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
                Applicants
            </Typography>
            <div className='mt-8 w-5/6 mx-auto'>
                <div className='flex flex-row space-x-2'>
                    <TextField
                        id="search"
                        type="search"
                        label="Search"
                        
                        value={searchTerm?searchTerm:"Azure Cloud Intern"}
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
                                <TableCell align="center">Applied</TableCell>
                                <TableCell align="center">Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {allStudent.length > 0 ?
                            allStudent.map((row, index) => (
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
                                    <TableCell align="center">{row.email}</TableCell>
                                    <TableCell align="center">{row.phoneNumber}</TableCell>
                                    <TableCell align="center">10/10/2023</TableCell>
                                    <TableCell align="center">
                                        <Box sx={{ '& > :not(style)': { m: 0.1 } }}>
                                            <IconButton href={'/company/applicant/'+row.id}><ContactEmergencyIcon /></IconButton>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            )):<></>}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </>
    );
}