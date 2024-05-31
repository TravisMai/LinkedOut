import InputAdornment from "@mui/material/InputAdornment";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import React, { useEffect, useState } from "react";
import {
    Box,
    IconButton,
    Pagination,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "react-query";
import axios from "axios";
import { Check, Close } from "@mui/icons-material";
import { getJwtToken } from "../../../shared/utils/authUtils";
import DefaultAvatar from "@/shared/assets/default-image.jpeg";


type ResponseType = {
    data: any;
};

export default function VerifyCompany() {

    const [allPendingCompany, setAllPendingCompany] = useState<companyType[]>([]);

    const token = getJwtToken();

    // Fetch all company
    useQuery({
        queryKey: "allCompany",
        queryFn: () =>
            axios.get("https://linkedout-hcmut.feedme.io.vn/api/v1/company", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }),
        onSuccess: (data) => {
            // Filter only company with isVerify = false
            setAllPendingCompany(data.data?.filter((company: companyType) => !company.isVerify));
        },
    });

    const queryClient = useQueryClient();

    // Mutation to send form data to server
    const mutationVerifyCompany= useMutation<ResponseType, ErrorType, { verify: boolean; id: string; property: string }>({
        mutationFn: ({ verify, id, property }) => {
            // Create an object with a dynamic property
            const requestBody = {
                [property]: verify
            };

            return axios.put(
                `https://linkedout-hcmut.feedme.io.vn/api/v1/company/${id}`,
                requestBody,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
        },
        onSuccess: () => {
            // Invalidate and refetch 'allStudent' queries to reflect changes
            queryClient.invalidateQueries("allCompany");
        },
        onError: () => {
            // Log the error if mutation fails
            console.error(mutationVerifyCompany.error);
        },
        onMutate: () => {
            // Optional callback to perform actions just before the mutation
        },
    });

    const handleDeleteCompany = (companyId: string) => {
        mutationDeleteCompany.mutate({ companyId });
    };
    const mutationDeleteCompany = useMutation<ResponseType, ErrorType, { companyId: string }>({
        mutationFn: ({ companyId }) => {
            return axios.delete(
                `https://linkedout-hcmut.feedme.io.vn/api/v1/student/${companyId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                },
            );
        },
        onSuccess: () => {
            queryClient.invalidateQueries("allCompany");
        },
        onError: () => {
            console.log(mutationDeleteCompany.error);
        },
        onMutate: () => { },
    });

    // Handlde submission
    const handleVerifyCompany = (verify: boolean, id: string, property: string) => {
        mutationVerifyCompany.mutate({ verify, id, property });
    };

    // Filter verify that have email match partially or all of the searchTerm
    const [searchTerm, setSearchTerm] = React.useState("");
    const [filteredVerify, setFilteredVerify] = React.useState<companyType[]>([]);
    useEffect(() => {
        setFilteredVerify(allPendingCompany?.filter((verify) =>
            verify.email.toLowerCase().includes(searchTerm.toLowerCase()),
        ));
    }, [searchTerm, allPendingCompany]);

    // Handle pagination
    const itemsPerPage = 10; // Number of items per page

    // State variables for pagination
    const [currentPage, setCurrentPage] = useState(0);

    // Handle page change
    const handlePageChange = (value: number) => {
        setCurrentPage(value);
    };

    // Limit display
    const limitedDisplay = filteredVerify.slice(
        itemsPerPage * currentPage,
        itemsPerPage * currentPage + itemsPerPage,
    );

    return (
        <div className="mt-10">
            <div className="flex flex-row space-x-2">
                <TextField
                    id="search"
                    type="search"
                    label="Search by email"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{ width: 500 }}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                />
            </div>
            <TableContainer component={Paper} className="mt-5">
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">No.</TableCell>
                            <TableCell align="center">Avatar</TableCell>
                            <TableCell align="center">Name</TableCell>
                            <TableCell align="center">Email</TableCell>
                            <TableCell align="center">Tax ID</TableCell>
                            <TableCell align="center">Phone</TableCell>
                            <TableCell align="center">Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {limitedDisplay?.map((row, index) =>
                        (
                            <TableRow
                                key={row.id}
                                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                            >
                                <TableCell align="center">{++index + itemsPerPage * currentPage}</TableCell>
                                <TableCell align="center">
                                    <img
                                        src={
                                            !row?.avatar?.includes("https://scontent")
                                                ? row?.avatar
                                                : DefaultAvatar
                                                ?? DefaultAvatar
                                        }
                                        className="h-10 mx-auto" />
                                </TableCell>
                                <TableCell align="center">{row?.name}</TableCell>
                                <TableCell align="center">{row?.email}</TableCell>
                                <TableCell align="center">{row?.taxId ?? "---"}</TableCell>
                                <TableCell align="center">{row?.phoneNumber}</TableCell>
                                <TableCell align="center">
                                    <Box sx={{ "& > :not(style)": { m: 0.1 } }}>
                                        <IconButton onClick={() => handleVerifyCompany(true, row.id, "isVerify")}>
                                            <Check />
                                        </IconButton>
                                        <IconButton onClick={() => handleDeleteCompany(row.id)}>
                                            <Close />
                                        </IconButton>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ),
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <div className="w-full mt-2 mb-6 flex justify-center ">
                <Stack spacing={2}>
                    <Pagination
                        count={Math.ceil(filteredVerify?.length / itemsPerPage)}
                        onChange={(_event, value) => handlePageChange(value - 1)}
                    />
                </Stack>
            </div>
        </div>
    );
}
