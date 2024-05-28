import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { useState } from "react";
import { useQuery } from "react-query";
import axios from "axios";
import { getJwtToken } from "../../../shared/utils/authUtils";
import { Pagination, Stack, Tooltip, Typography } from "@mui/material";
import { Download } from "@mui/icons-material";

export default function InternshipResult() {
  const [allInternship, setAllInternship] = useState<internshipType[]>([]);

  // Get jwt token

  const token = getJwtToken();

  // Fetch all internships
  useQuery({
    queryKey: "allInternship",
    queryFn: () =>
      axios.get("https://linkedout-hcmut.feedme.io.vn/api/v1/internship", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    onSuccess: (data) => {
      // Filter only internships that have jobApplicants with status "Approved"
      setAllInternship(data.data.filter((internship: internshipType) => internship.jobApplicants.status === "Approved"));
    },
  });


  // Handle pagination
  const itemsPerPage = 7;
  const [currentPage, setCurrentPage] = useState(0);

  // Handle page change
  const handlePageChange = (value: number) => {
    setCurrentPage(value);
  };

  const limitedJobs = allInternship.slice(
    itemsPerPage * currentPage,
    itemsPerPage * currentPage + itemsPerPage,
  );


  return (
    <>
      <div className="mt-8 w-full mx-auto">
        <Typography variant="h5" className="text-center">Internship results</Typography>
        <TableContainer component={Paper} className="mt-5">
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="center">No.</TableCell>
                <TableCell align="center">Company</TableCell>
                <TableCell align="center">Job</TableCell>
                <TableCell align="center">Student</TableCell>
                <TableCell align="center">Result</TableCell>
                <TableCell align="center">Internship Result File</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {limitedJobs.map((row, index) => (
                <TableRow
                  key={row.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell align="center">{++index + itemsPerPage * currentPage}</TableCell>
                  <TableCell align="center">{row.jobApplicants.job.company.name}</TableCell>
                  <TableCell align="center">{row.jobApplicants.job.title}</TableCell>
                  <TableCell align="center">{row.jobApplicants.student.name}</TableCell>
                  <TableCell align="center">{row?.result ?? "---"}</TableCell>
                  <TableCell align="center">
                    <Box sx={{ "& > :not(style)": { m: 0.1 } }}>
                      <Tooltip title="Internship Program">
                        {row?.document?.find(doc => doc.name === "Internship result") ? (
                          <IconButton
                            href={
                              // Get the link of the document named "Recuirtment result"
                              row?.document?.find(doc => doc.name === "Internship result")?.url ?? ""
                            }
                          >
                            <Download />
                          </IconButton>) : (
                          <Typography variant="body2" color="error">No internship result</Typography>
                        )}
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <div className="w-full mt-2 flex justify-center ">
          <Stack spacing={2}>
            <Pagination
              count={Math.ceil(allInternship.length / itemsPerPage)}
              onChange={(_event, value) => handlePageChange(value - 1)}
            />
          </Stack>
        </div>

      </div>
    </>
  );
}
