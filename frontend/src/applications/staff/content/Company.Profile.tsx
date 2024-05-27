import { Card, CardContent, Container, Grid, List, Pagination, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { getJwtToken } from "../../../shared/utils/authUtils";
import { useMutation, useQuery } from "react-query";
import axios from "axios";
import { LoadingButton } from "@mui/lab";

export default function CompanyProfile({
  company,
  handleClose,
}: {
  company: companyType;
  handleClose: () => void;
}) {
  // Fetch for company info
  const token = getJwtToken();

  // Fetch all jobs
  const [jobs, setJobs] = useState<jobType[]>([]);
  useQuery({
    queryKey: "allJobs",
    queryFn: () =>
      axios.get("https://linkedout-hcmut.feedme.io.vn/api/v1/job", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    onSuccess: (data) => {
      setJobs(data.data);
    },
  });
  // Extract job of current company
  const companyJobs = jobs.filter((job) => job.company.id === company.id);

  // Handle pagination
  const itemsPerPage = 3; // Number of items per page

  // State variables for pagination
  const [currentPage, setCurrentPage] = useState(0);

  // Handle page change
  const handlePageChange = (value: number) => {
    setCurrentPage(value);
  };

  // Limit display jobs
  const limitedJobs = companyJobs.slice(
    itemsPerPage * currentPage,
    itemsPerPage * currentPage + itemsPerPage,
  );


  // Handle delete

  const handleDelete = () => {
    mutationDelete.mutate();
  };
  const mutationDelete = useMutation<ResponseType, ErrorType>({
    mutationFn: () => {
      return axios.delete(
        `https://linkedout-hcmut.feedme.io.vn/api/v1/company/${company.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
    },
    onSuccess: () => {
      handleClose();

    },
    onError: () => {
      console.log(mutationDelete.error);
    },
    onMutate: () => { },
  });

  return (
    <Grid container>
      <Grid item xs={8}>
        <Container
          disableGutters={true}
          sx={{
            width: 8 / 10,
            bgcolor: "white",
            display: "flex",
            flexDirection: "column",
            gap: 2,
            borderRadius: 3,
            mb: 2,
            pb: 3,
            mt: 5,
          }}
        >
          <Container
            disableGutters={true}
            sx={{
              alignContent: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 1,
            }}
          >
            <img
              src={`${company?.avatar}`} // Append a unique query parameter to bypass browser caching
              className=" w-full rounded-xl mx-auto  border-2 border-blue-300"
            />
          </Container>

          <Typography variant="body1" className="pl-5">
            Name: <span className="font-bold">{company?.name} </span>{" "}
          </Typography>
          <Typography variant="body1" className="pl-5">
            Email: <span className="font-bold">{company?.email} </span>
          </Typography>
          <Typography variant="body1" className="pl-5">
            Phone: <span className="font-bold">{company?.phoneNumber} </span>
          </Typography>
          <Typography variant="body1" className="pl-5">
            Address: <span className="font-bold">{company?.address} </span>
          </Typography>
          <Typography variant="body1" className="pl-5">
            Work Field: <span className="font-bold">{company?.workField} </span>
          </Typography>
          <Typography variant="body1" className="pl-5">
            Description:{" "}
            <span className="font-bold">{company?.description} </span>
          </Typography>
          <Typography variant="body1" className="pl-5">
            Website: <span className="font-bold">{company?.website} </span>
          </Typography>
          <Typography variant="body1" className="pl-5">
            Tax ID: <span className="font-bold">{company?.taxId} </span>
          </Typography>

          <Container
            disableGutters={true}
            sx={{
              alignContent: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          ></Container>
          <LoadingButton
            variant="contained"
            color="error"
            sx={{ width: "inherit", marginX: "auto" }}
            onClick={handleDelete}
          >
            Delete
          </LoadingButton>
        </Container>
      </Grid>
      <Grid item xs={4}>
        {/* Posted jobs */}
        <Container
          disableGutters={true}
          sx={{
            bgcolor: "white",
            display: "flex",
            flexDirection: "column",
            gap: 2,
            borderRadius: 3,
            mb: 2,
            pb: 3,
            mt: 5,
          }}
        >
          <Typography variant="h6" className="pl-5">
            {" "}
            Posted Jobs
          </Typography>
          {companyJobs.length > 0 ? (
            <>
              <div className="w-full mt-2 flex justify-center ">
                <Stack spacing={2}>
                  <Pagination
                    count={Math.ceil(companyJobs.length / itemsPerPage)}
                    onChange={(_event, value) => handlePageChange(value - 1)}
                    boundaryCount={0}
                    siblingCount={0}
                  />
                </Stack>
              </div>
              <List>
                {limitedJobs.map((job) => (
                  <Card sx={{ width: 170, mt: 2 }}>
                    <CardContent>
                      <div className="flex flex-row">
                        <div className="basis-5/6">
                          <Typography variant="h5" component="div">
                            {job.title}
                          </Typography>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </List>

            </>
          ) : (
            <Typography>No posted job</Typography>
          )}
        </Container>
      </Grid>
    </Grid>
  );
}
