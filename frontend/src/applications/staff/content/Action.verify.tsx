import InputAdornment from "@mui/material/InputAdornment";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import Button from "@mui/material/Button";
import React, { useState } from "react";
import Pagination from "@mui/material/Pagination";
import Fab from "@mui/material/Fab";
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { Box, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "react-query";
import axios from "axios";
import { Check } from "@mui/icons-material";
import { getJwtToken } from "../../../shared/utils/authUtils";

type studentType = {
    "id": string,
    "name": string,
    "email": string,
    "phoneNumber": string,
    "avatar": string,
    "isGoogle": boolean,
    "isVerify": boolean,
}

type ResposeType = {
    data: {
        student: {
            id: string;
            name: string;
            email: string;
            phoneNumber: string;
            avatar: string;
            isGoogle: boolean;
            isVerify: boolean;
        };
        token: string;
    };
}

interface newForm {
    isVerify: boolean;
}


export default function Verify() {
    const [searchTerm, setSearchTerm] = React.useState("");


    const [allStudent, setAllStudent] = useState<studentType[]>([]);


    const token = getJwtToken();

    // Fetch all students
    useQuery({
        queryKey: "allStudent",
        queryFn: () => axios.get("http://52.163.112.173:4000/api/v1/student", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }),
        onSuccess: (data) => {
            console.log(data.data);
            setAllStudent(data.data);
        }
    });

    const queryClient = useQueryClient();

    // Mutation to send form data to server    
    const mutation = useMutation<ResposeType, ErrorType, { verify: boolean, id: string }>({
        mutationFn: ({ verify, id }) => axios.put(`http://52.163.112.173:4000/api/v1/student/${id}`,
            { isVerify: verify },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        ),
        onSuccess: (data) => {
            console.log(data);
            queryClient.invalidateQueries("allStudent");
            // setSending(false);
            // setShowError(false);
            // setShowSuccess(true);
            // setTimeout(() => {
            //     setShowSuccess(false); // Hide the success message
            // }, 5000);
        },
        onError: () => {
            console.log(mutation.error);
            // setSending(false);
            // setShowError(true);
        },
        onMutate: () => {
            // setSending(true);
            // setShowError(false);
        }
    }
    );

    // Handlde submission
    const handleSubmit = (verify: boolean, id: string) => {
        mutation.mutate({ verify, id });
    };

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
            {/* <Paper elevation={3} className="mt-5">
                <div className="flex flex-row justify-between items-center px-5 py-3">
                    <div className="flex flex-col items-left space-y-2 w-5/6 border-r-2">
                        <Typography
                            component="h1"
                            variant="h5"
                            align="left"
                            color="text.primary"
                            gutterBottom
                            sx={{ pt: 2 }}
                        >
                            Company Information
                        </Typography>
                        <p className="h-10">Company Name: Software Two</p>
                        <p className="h-10">Tax ID: 8375392839</p>
                        <p className="h-10">Representative Name: Le Chi Hung</p>
                        <p className="h-10">Representative Email: lechihung@software2.com.vn</p>
                        <p className="h-10">Representative Phone Number: +84938162829</p>
                        <p className="h-10">Company Address: Room 236, Level 2, Tung Shing Circle Building, 999 Ngo Quyen Street Hoan Kiem District Hanoi Vietnam</p>
                        <p className="h-10">Company Website: softwaretwo.com.vn</p>
                    </div>
                    <div className="flex flex-col items-center space-y-10 w-1/6">
                        <Fab size="medium" color="success" aria-label="add">
                            <CheckIcon />
                        </Fab>
                        <Fab size="medium" aria-label="add">
                            <MoreHorizIcon />
                        </Fab>
                        <Fab size="medium" color="error" aria-label="add">
                            <CloseIcon />
                        </Fab>
                    </div>
                </div>
            </Paper>
            <Pagination count={10} variant="outlined" shape="rounded" className="mt-5 flex justify-center" /> */}
            <TableContainer component={Paper} className='mt-5'>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align='center'>No.</TableCell>
                            <TableCell align="center">Avatar</TableCell>
                            <TableCell align="center">Name</TableCell>
                            <TableCell align="center">Email</TableCell>
                            <TableCell align="center">StudentID</TableCell>
                            <TableCell align="center">Phone</TableCell>
                            <TableCell align="center">Year</TableCell>
                            <TableCell align="center">Class code</TableCell>
                            <TableCell align="center">Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {allStudent.map((row, index) => (
                            row.isVerify ? null :
                                <TableRow
                                    key={row.id}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >

                                    <TableCell align='center'>{++index}</TableCell>
                                    <TableCell align="center">
                                        <img
                                            src={row.avatar}
                                            className='h-10 mx-auto'
                                        />
                                    </TableCell>
                                    <TableCell align="center">{row.name}</TableCell>
                                    <TableCell align="center">{row.email}</TableCell>
                                    <TableCell align="center">{row.id}</TableCell>
                                    <TableCell align="center">{row.phoneNumber}</TableCell>
                                    <TableCell align="center">Year</TableCell>
                                    <TableCell align="center">Class Code</TableCell>
                                    <TableCell align="center">
                                        <Box sx={{ '& > :not(style)': { m: 0.1 } }}>
                                            <IconButton onClick={() => handleSubmit(true, row.id)}><Check /></IconButton>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )

}