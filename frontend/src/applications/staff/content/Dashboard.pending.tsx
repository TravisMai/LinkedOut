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

// const rows = [
//     createData(
//         0,
//         '16 Mar, 2019',
//         'BAN',
//         'HQRQ',
//         30152512,
//         "https://bard.google.com/chat"
//     ),
//     createData(
//         1,
//         '16 Mar, 2019',
//         'Vonenteq',
//         'Tran Tri Dat',
//         86635523,
//         'https://mui.com'
//     ),
//     createData(
//         2,
//         '16 Mar, 2019',
//         'Byzocu',
//         'Mai Huu Nghia',
//         1008513251,
//         'File'
//     ),
//     createData(
//         3,
//         '16 Mar, 2019',
//         'Voltage Computing',
//         'Le Chi Hung',
//         6545325239,
//         'File'
//     ),
//     createData(
//         4,
//         '15 Mar, 2019',
//         'Shockrip',
//         'Dinh Xuan Mai',
//         5523532323,
//         'File'
//     ),
// ];

// function preventDefault(event: React.MouseEvent) {
//     event.preventDefault();
// }

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
      const pendingStudent = data.data.filter(
        (student: studentType) => student.isVerify === false,
      );
      setAllPendingStudent(pendingStudent);
    },
  });

  const limitedDisplay = 10;
  const displayPending = allPendingStudent.slice(0, limitedDisplay);

  // Handlde verify student
  const handleVerify = (verify: boolean, id: string, property: string) => {
    mutationVerify.mutate({ verify, id, property });
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

  // Handle delte student
  const handleDelete = (studentId: string) => {
    mutationDelete.mutate({ studentId });
  };
  const mutationDelete = useMutation<ResponseType, ErrorType, { studentId: string }>({
    mutationFn: ({ studentId }) => {
      return axios.delete(
        `https://linkedout-hcmut.feedme.io.vn/api/v1/student/${studentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
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

  return (
    <React.Fragment>
      <Typography component="h2" variant="h6" color="primary" gutterBottom>
        Pending verification
      </Typography>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Student ID</TableCell>
            <TableCell>Student Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Phone Number</TableCell>
            <TableCell align="right">Quick action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {displayPending?.map((row) =>
            row.isVerify && !row.isActive ? null : (
              <TableRow key={row.id}>
                <TableCell>{row.studentId}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.email}</TableCell>
                <TableCell>{row.phoneNumber}</TableCell>
                {/* <TableCell>
                                <Link color="primary" href={row.file} target="_blank" onClick={handleDisplay("Action / Verify")} sx={{ mt: 3 }}>
                                    File
                                </Link>
                            </TableCell> */}
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
        href="#"
        onClick={handleDisplay("Action / Verify")}
        sx={{ mt: 3 }}
      >
        See all pending verification
      </Link>
    </React.Fragment>
  );
}
