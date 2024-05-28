import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import ContactEmergencyIcon from "@mui/icons-material/ContactEmergency";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import axios from "axios";
import { getJwtToken } from "../../../shared/utils/authUtils";
import { Pagination, Stack, Tooltip } from "@mui/material";
import JobDialog from "./Job.Dialog";

export default function AllJob() {
  const [allJob, setAllJob] = useState<jobType[]>([]);

  // Get jwt token

  const token = getJwtToken();

  // Fetch all jobs
  useQuery({
    queryKey: "allJobs",
    queryFn: () =>
      axios.get("https://linkedout-hcmut.feedme.io.vn/api/v1/job", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    onSuccess: (data) => {
      setAllJob(data.data);
    },
  });

  // Filter jobs that have name match partially or all of the searchTerm
  const [searchTerm, setSearchTerm] = React.useState("");
  const [filteredJob, setFilteredJob] = React.useState<jobType[]>([]);
  useEffect(() => {
    setFilteredJob(allJob.filter((job) =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase()),
    ));
  }, [searchTerm, allJob]);

  // Handle pagination
  const itemsPerPage = 7;
  const [currentPage, setCurrentPage] = useState(0);

  // Handle page change
  const handlePageChange = (value: number) => {
    setCurrentPage(value);
  };

  const limitedJobs = filteredJob.slice(
    itemsPerPage * currentPage,
    itemsPerPage * currentPage + itemsPerPage,
  );

  // Job Dialog
  const [openDialog, setOpenDialog] = React.useState(false);
  const queryClient = useQueryClient();
  const handleCloseDialog = () => {
    queryClient.invalidateQueries("allJobs");
    setOpenDialog(false);
  };

  const [selectedJob, setSelectedJob] = useState<jobType>();
  const handleOpenJob = (jobId: string) => {
    // Get the company from allcompanys that match
    const company = allJob.find((job) => job.id === jobId);
    setSelectedJob(company);
    setOpenDialog(true);
  };

  return (
    <>
      <div className="mt-8 w-full mx-auto">
        <div className="flex flex-row space-x-2">
          <TextField
            id="search"
            type="search"
            label="Search by job title"
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
                <TableCell align="center">Title</TableCell>
                <TableCell align="center">Company</TableCell>
                <TableCell align="center">Work Type</TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {limitedJobs.map((row, index) => (
                <TableRow
                  key={row.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell align="center">{++index + itemsPerPage * currentPage}</TableCell>
                  <TableCell align="center">{row.title}</TableCell>
                  <TableCell align="center">{row.company.name}</TableCell>
                  <TableCell align="center">{row?.workType}</TableCell>
                  <TableCell align="center">
                    <Box sx={{ "& > :not(style)": { m: 0.1 } }}>
                      <Tooltip title="company Info">
                        <IconButton
                          onClick={() => {
                            handleOpenJob(row.id);
                          }}
                        >
                          <ContactEmergencyIcon />
                        </IconButton>
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
              count={Math.ceil(filteredJob.length / itemsPerPage)}
              onChange={(_event, value) => handlePageChange(value - 1)}
            />
          </Stack>
        </div>
        {selectedJob && (
          <JobDialog
            job={selectedJob}
            state={openDialog}
            onClose={handleCloseDialog}
          />
        )}
      </div>
    </>
  );
}
