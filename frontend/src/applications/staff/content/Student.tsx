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
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import Link from '@mui/material/Link';
import { useState } from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';

function createData(
    studentId: number,
    name: string,
    email: string,
    status: string,
    company: string,
    companyLink: string,
) {
    return { studentId, email, name, status, company, companyLink };
}

type studentType = {
    "id": string,
    "name": string,
    "email": string,
    "phoneNumber": string,
    "avatar": string,
    "isGoogle": boolean,
    "isVerify": boolean,
}

const rows = [
    createData(2052443, 'Trần Trí Đạt', 'dat.trantri2002@gmail.com', 'Intern', 'Noventiq', 'https://mui.com'),
    createData(2052612, 'Mai Hữu Nghĩa', 'nghia.maiemches@hcmut.edu.vn', 'Fresher', 'Cybozu', 'https://mui.com'),
    createData(2052508, 'Lê Chí Hùng', 'hung.lechpro@hcmut.edu.vn', 'Intern', 'Ampere', 'https://mui.com'),
    createData(2052650, 'Đinh Xuân Phú', 'phu.dinh153@hcmut.edu.vn', 'Senior Intern', 'Rockship', 'https://mui.com'),
];


export default function Student() {
    const [allStudent, setAllStudent] = useState<studentType[]>([]);

    // Get jwt token
    const getJwtToken = () => {
        return document.cookie.split("; ").find((cookie) => cookie.startsWith("jwtToken="))?.split("=")[1];
    };

    const token = getJwtToken();

    // Fetch all students
    useQuery({
        queryKey: "allStudent",
        queryFn: () => axios.get("http://localhost:5000/api/v1/student", {
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
        <div className='mt-10'>
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
            </div>
            <TableContainer component={Paper} className='mt-5'>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align='center'>No.</TableCell>
                            <TableCell align='center'>Name</TableCell>
                            <TableCell align="center">Email</TableCell>
                            <TableCell align="center">Phone</TableCell>
                            <TableCell align="center">Action</TableCell>
                            <TableCell align="center"></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {allStudent.map((row, index) => (
                            <TableRow
                                key={row.id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >

                                <TableCell align='center'>{++index}</TableCell>
                                <TableCell align="center">{row.name}</TableCell>
                                <TableCell align="center">{row.email}</TableCell>
                                <TableCell align="center">{row.phoneNumber}</TableCell>

                                {/* <TableCell align="center">
                                    <Link color="primary" href={row.companyLink} target="_blank" sx={{ mt: 3 }}>
                                        {row.company}
                                    </Link>
                                </TableCell> */}
                                <TableCell align="center">
                                    <Box sx={{ '& > :not(style)': { m: 0.1 } }}>
                                        <IconButton><AccountBoxIcon /></IconButton>
                                        <IconButton><MoreHorizIcon /></IconButton>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}