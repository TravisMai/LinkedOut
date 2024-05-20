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
import { useQuery, useQueryClient } from 'react-query';
import axios from 'axios';
import { getJwtToken } from '../../../shared/utils/authUtils';
import { Pagination, Stack, Tooltip } from '@mui/material';
import CompanyDialog from './Company.Dialog';
import { OpenInNew } from '@mui/icons-material';


export default function Company() {

    const [allCompany, setAllCompany] = useState<companyType[]>([]);

    const token = getJwtToken();

    // Fetch all companies
    useQuery({
        queryKey: "allCompany",
        queryFn: () => axios.get("https://linkedout-hcmut.feedme.io.vn/api/v1/company", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }),
        onSuccess: (data) => {
            console.log(data.data);
            setAllCompany(data.data);
        }
    });

    // Handle pagination
    const itemsPerPage = 10; // Number of items per page

    // State variables for pagination
    const [currentPage, setCurrentPage] = useState(0);

    // Handle page change
    const handlePageChange = (value: number) => {
        setCurrentPage(value);
    };

    // Limit display
    const limitedDisplay = allCompany.slice(itemsPerPage * currentPage, itemsPerPage * currentPage + itemsPerPage);

    // company Profile Dialog
    const [openDialog, setOpenDialog] = React.useState(false);
    const queryClient = useQueryClient();
    const handleCloseDialog = () => {
        queryClient.invalidateQueries("allcompany123");
        setOpenDialog(false);
    }

    const [selectedCompany, setSelectedCompany] = useState<companyType>();
    const handleOpenCompany = (companyId: string) => {
        // Get the company from allcompanys that match
        const company = allCompany.find((company) => company.id === companyId);
        setSelectedCompany(company);
        setOpenDialog(true);
    }

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
            </div>
            <TableContainer component={Paper} className='mt-5 px-5'>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align='left'>No.</TableCell>
                            <TableCell align='center'>Logo</TableCell>
                            <TableCell align="left">Name</TableCell>
                            <TableCell align="left">Phone</TableCell>
                            <TableCell align="left">Email</TableCell>
                            <TableCell align="left">Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {limitedDisplay?.map((row, index) => (
                            <TableRow
                                key={row.id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >

                                <TableCell align='left'>{++index + itemsPerPage * currentPage}</TableCell>
                                <TableCell align="center">
                                    <img
                                        src={row.avatar}
                                        className='h-10 mx-auto'
                                    />
                                </TableCell>
                                <TableCell align="left">{row.name}</TableCell>
                                <TableCell align="left">{row.phoneNumber}</TableCell>
                                <TableCell align="left">{row.email}</TableCell>
                                <TableCell align="left">
                                    <Box sx={{ '& > :not(style)': { m: 0.1 } }}>
                                        <Tooltip title="company Info">
                                            <IconButton onClick={() => { handleOpenCompany(row.id) }}><OpenInNew /></IconButton>
                                        </Tooltip>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        )) ?? "No company found"}
                    </TableBody>
                </Table>
            </TableContainer>
            <div className='w-full mt-2 mb-6 flex justify-center '>
                <Stack spacing={2} >
                    <Pagination
                        count={Math.ceil(allCompany.length / itemsPerPage)}
                        onChange={(_event, value) => handlePageChange(value - 1)}
                    />
                </Stack>
            </div>
            {selectedCompany && (
                <CompanyDialog
                    company={selectedCompany}
                    state={openDialog}
                    onClose={handleCloseDialog}
                />
            )}
        </div>
    );
}