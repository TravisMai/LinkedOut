import { useState } from "react";
import { useQuery } from "react-query";
import axios from "axios";
import CompanyAppBar from "../CompanyAppBar.component";
import { Typography } from "@mui/material";
import { getJwtToken } from "../../../shared/utils/authUtils";
import InternshipJobCard from "./InternshipJobCard.component";

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
  const internshipJobs = companyJobs.filter(
    (job) => job.workType === "Internship",
  );
  // Sort descending by date
  internshipJobs.sort((a, b) => {
    return new Date(b.created).getTime() - new Date(a.created).getTime();
  });

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

      <div className="mt-3 w-5/6  mx-auto h-fit flex flex-col space-y-3 pb-10">
        {internshipJobs.length > 0 ? (
          internshipJobs.map((job: jobType) => (
            <InternshipJobCard key={job.id} job={job} />
          ))
        ) : (
          <p>Currently you have no waiting candidates</p>
        )}
      </div>
    </>
  );
}
