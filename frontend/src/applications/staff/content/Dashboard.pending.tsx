import * as React from "react";
import Link from "@mui/material/Link";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import axios from "axios";
import { getJwtToken } from "../../../shared/utils/authUtils";
import { Divider } from "@mui/material";

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

export default function Pending(props: any) {
  const token = getJwtToken();

  function handleDisplay(index: string) {
    return () => {
      props.display(index);
    };
  }

  // Fetch all students
  const [allPendingStudent, setAllPendingStudent] = useState<studentType[]>([]);
  useQuery({
    queryKey: "allStudent",
    queryFn: () =>
      axios.get("https://linkedout-hcmut.feedme.io.vn/api/v1/student", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    onSuccess: (data) => {
      const pendingStudent = data.data?.filter(
        (student: studentType) => student?.isVerify === false,
      );
      setAllPendingStudent(pendingStudent);
    },
  });

  // Fetch all companies
  const [allPendingCompanies, setAllPendingCompanies] = useState<companyType[]>([]);
  useQuery({
    queryKey: "allCompany",
    queryFn: () =>
      axios.get("https://linkedout-hcmut.feedme.io.vn/api/v1/company", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    onSuccess: (data) => {
      const pendingCompany = data.data?.filter(
        (company: companyType) => company?.isVerify === false,
      );
      setAllPendingCompanies(pendingCompany);
    },
  });

  const limitedDisplay = 3;
  const displayPending = allPendingStudent.slice(0, limitedDisplay);
  const displayPendingCompanies = allPendingCompanies.slice(0, limitedDisplay);

  // Handlde verify student
  const handleVerify = (verify: boolean, id: string, property: string) => {
    mutationVerify.mutate({ verify, id, property });
  };

  // Handlde verify company
  const handleVerifyCompany = (verify: boolean, id: string, property: string) => {
    mutationVerifyCompany.mutate({ verify, id, property });
  };

  // Mutation to send form data to server
  const queryClient = useQueryClient();
  const mutationVerify = useMutation<ResponseType, ErrorType, { verify: boolean; id: string; property: string }>({
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
      console.error(mutationVerify.error);
    },
    onMutate: () => {
      // Optional callback to perform actions just before the mutation
    },
  });

  // Mutation to send form data to server company
  const mutationVerifyCompany = useMutation<ResponseType, ErrorType, { verify: boolean; id: string; property: string }>({
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
      // Invalidate and refetch 'allCompany' queries to reflect changes
      queryClient.invalidateQueries("allCompany");
    },
    onError: () => {
      // Log the error if mutation fails
      console.error(mutationVerify.error);
    },
    onMutate: () => {
      // Optional callback to perform actions just before the mutation
    },
  });

  // Handle delte student
  const handleDelete = (studentId: string) => {
    mutationDelete.mutate({ studentId });
  };

  // Handle delte company
  const handleDeleteCompany = (companyId: string) => {
    mutationDeleteCompany.mutate({ companyId });
  };

  const mutationDelete = useMutation<ResponseType, ErrorType, { studentId: string }>({
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
      console.log(mutationDelete.error);
    },
    onMutate: () => { },
  });

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
      console.log(mutationDelete.error);
    },
    onMutate: () => { },
  });

  return (
    <React.Fragment>
      <Typography component="h2" variant="h6" color="primary" gutterBottom>
        Pending verification
      </Typography>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold' }}>Student Name</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Phone Number</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Student ID</TableCell>
            <TableCell align="right" sx={{ fontWeight: 'bold' }}>Quick action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {displayPending?.map((row) =>
            row.isVerify && !row.isActive ? null : (
              <TableRow key={row.id}>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.email}</TableCell>
                <TableCell>{row.phoneNumber}</TableCell>
                <TableCell>{row.studentId}</TableCell>
                <TableCell align="right">
                  <Box sx={{ "& > :not(style)": { m: 0.1 } }}>
                    <IconButton
                      onClick={() => handleVerify(true, row.id, "isVerify")}
                    >
                      <CheckIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDelete(row.id)}
                    >
                      <CloseIcon />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ),
          ) ?? "No pending verification"}
        </TableBody>
      </Table>
      <Link
        color="primary"
        onClick={handleDisplay("Action / Verify student")}
        sx={{ marginX: 'auto', mt: 1, mb: 1 }}
      >
        See all pending students
      </Link>

      <Divider />
      {/* ------------------------------------- */}
      <Divider />

      <Table size="small" sx={{ mt: 1 }}>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold' }}>Company Name</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Phone Number</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Tax ID</TableCell>
            <TableCell align="right" sx={{ fontWeight: 'bold' }}>Quick action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {displayPendingCompanies?.map((row) =>
            row.isVerify && !row.isActive ? null : (
              <TableRow key={row.id}>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.email}</TableCell>
                <TableCell>{row.phoneNumber}</TableCell>
                <TableCell>{row?.taxId ?? "---"}</TableCell>
                <TableCell align="right">
                  <Box sx={{ "& > :not(style)": { m: 0.1 } }}>
                    <IconButton
                      onClick={() => handleVerifyCompany(true, row.id, "isVerify")}
                    >
                      <CheckIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDeleteCompany(row.id)}
                    >
                      <CloseIcon />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ),
          ) ?? "No pending verification"}
        </TableBody>
      </Table>
      <Link
        color="primary"
        onClick={handleDisplay("Action / Verify company")}
        sx={{ marginX: 'auto', mt: 1 }}
      >
        See all pending companies
      </Link>
    </React.Fragment>

  );
}
