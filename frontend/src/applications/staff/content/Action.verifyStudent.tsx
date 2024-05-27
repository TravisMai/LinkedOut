import InputAdornment from "@mui/material/InputAdornment";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import Button from "@mui/material/Button";
import React, { useState } from "react";
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

type ResponseType = {
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
};

export default function Verify() {
  const [searchTerm, setSearchTerm] = React.useState("");

  const [allPendingStudent, setAllPendingStudent] = useState<studentType[]>([]);

  const token = getJwtToken();

  // Fetch all students
  useQuery({
    queryKey: "allStudent",
    queryFn: () =>
      axios.get("https://linkedout-hcmut.feedme.io.vn/api/v1/student", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    onSuccess: (data) => {
      // Filter only student with isVerify = false
      setAllPendingStudent(data.data.filter((student: studentType) => !student.isVerify));
    },
  });

  const queryClient = useQueryClient();

  // Mutation to send form data to server
  const mutationVerifyStudent = useMutation<ResponseType, ErrorType, { verify: boolean; id: string; property: string }>({
    mutationFn: ({ verify, id, property }) => {
      // Create an object with a dynamic property
      const requestBody = {
        [property]: verify
      };

      return axios.put(
        `https://linkedout-hcmut.feedme.io.vn/api/v1/student/${id}`,
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
      queryClient.invalidateQueries("allStudent");
    },
    onError: () => {
      // Log the error if mutation fails
      console.error(mutationVerifyStudent.error);
    },
    onMutate: () => {
      // Optional callback to perform actions just before the mutation
    },
  });

  const handleDeleteStudent = (studentId: string) => {
    mutationDeleteStudent.mutate({ studentId });
  };
  const mutationDeleteStudent = useMutation<ResponseType, ErrorType, { studentId: string }>({
    mutationFn: ({ studentId }) => {
      return axios.delete(
        `https://linkedout-hcmut.feedme.io.vn/api/v1/student/${studentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries("allStudent");
    },
    onError: () => {
      console.log(mutationDeleteStudent.error);
    },
    onMutate: () => { },
  });

  // Handlde submission
  const handleVerifyStudent = (verify: boolean, id: string, property: string) => {
    mutationVerifyStudent.mutate({ verify, id, property });
  };

  // Handle pagination
  const itemsPerPage = 10; // Number of items per page

  // State variables for pagination
  const [currentPage, setCurrentPage] = useState(0);

  // Handle page change
  const handlePageChange = (value: number) => {
    setCurrentPage(value);
  };

  // Limit display
  const limitedDisplay = allPendingStudent.slice(
    itemsPerPage * currentPage,
    itemsPerPage * currentPage + itemsPerPage,
  );

  return (
    <div className="mt-10">
      <div className="flex flex-row space-x-2">
        <TextField
          id="search"
          type="search"
          label="Search"
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
        <Button variant="contained">Search</Button>
      </div>
      <TableContainer component={Paper} className="mt-5">
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center">No.</TableCell>
              <TableCell align="center">Avatar</TableCell>
              <TableCell align="center">Name</TableCell>
              <TableCell align="center">Email</TableCell>
              <TableCell align="center">StudentID</TableCell>
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
                  <img src={row.avatar} className="h-10 mx-auto" />
                </TableCell>
                <TableCell align="center">{row.name}</TableCell>
                <TableCell align="center">{row.email}</TableCell>
                <TableCell align="center">{row.studentId}</TableCell>
                <TableCell align="center">{row.phoneNumber}</TableCell>
                <TableCell align="center">
                  <Box sx={{ "& > :not(style)": { m: 0.1 } }}>
                    <IconButton onClick={() => handleVerifyStudent(true, row.id, "isVerify")}>
                      <Check />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteStudent(row.id)}>
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
            count={Math.ceil(allPendingStudent.length / itemsPerPage)}
            onChange={(_event, value) => handlePageChange(value - 1)}
          />
        </Stack>
      </div>
    </div>
  );
}
