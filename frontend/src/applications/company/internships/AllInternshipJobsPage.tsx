import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import axios from "axios";
import CompanyAppBar from "../CompanyAppBar.component";
import { InputAdornment, TextField, Typography } from "@mui/material";
import { getJwtToken } from "../../../shared/utils/authUtils";
import InternshipJobCard from "./InternshipJobCard.component";
import { Search } from "@mui/icons-material";

export function AllInternshipJobsPage() {
  const [companyJobs, setCompanyJobs] = useState<jobType[]>([]);

  const token = getJwtToken();

  // Fetch company's jobs
  useQuery({
    queryKey: "companyJobs",
    queryFn: () =>
      axios.get("https://linkedout-hcmut.feedme.io.vn/api/v1/job/company", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    onSuccess: (data) => {
      setCompanyJobs(data.data);
    },
  });

  // Filter out internships
  const internshipJobs = companyJobs?.filter(
    (job) => job.workType === "Internship",
  );
  // Sort descending by date
  internshipJobs.sort((a, b) => {
    return new Date(b.created).getTime() - new Date(a.created).getTime();
  });

  // Filter students that have name match partially or all of the searchTerm
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredStudent, setFilteredStudent] = useState<jobType[]>([]);
  useEffect(() => {
    setFilteredStudent(internshipJobs?.filter((job) =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase()),
    ));
  }, [searchTerm, internshipJobs]);

  return (
    <>
      <CompanyAppBar />
      <Typography
        component="h1"
        variant="h4"
        align="center"
        color="text.primary"
        gutterBottom
        sx={{ pt: 3 }}
      >
        Internship Jobs
      </Typography>
      <div className="mt-8 w-5/6 mx-auto">
        <div className="flex flex-row space-x-2">
          <TextField
            id="search"
            type="search"
            label="Search by job title"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ width: 500, margin: "auto"}}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
        </div>
        <div className="mt-3 mx-auto h-fit flex flex-col space-y-3 pb-10">
          {filteredStudent?.length > 0 ? (
            filteredStudent?.map((job: jobType) => (
              <InternshipJobCard key={job.id} job={job} />
            ))
          ) : (
            <p>Currently you have no waiting candidates</p>
          )}
        </div>
      </div>
    </>
  );
}
