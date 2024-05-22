import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import axios from "axios";
import StudentCard from "./StudentCard.component";
import { Typography } from "@mui/material";
import { getJwtToken } from "../../shared/utils/authUtils";

const StudentList: React.FC = () => {
  const token = getJwtToken();

  const [companyJobs, setCompanyJobs] = useState<jobType[]>([]);

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

  const [allApplications, setAllApplications] = useState<jobApplicationType[]>(
    [],
  );

  // Fetch all applications of each job when jobs are fetched
  useEffect(() => {
    setAllApplications([]);
    const fetchApplications = async () => {
      companyJobs.forEach(async (job) => {
        try {
          const response = await axios.get(
            `https://linkedout-hcmut.feedme.io.vn/api/v1/job_applicants/${job.id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );
          setAllApplications((prevApplications) => [
            ...prevApplications,
            ...response.data,
          ]);
        } catch (error) {
          console.error(
            `Error fetching applications for job ${job.id}:`,
            error,
          );
        }
      });
    };

    fetchApplications();
  }, [companyJobs, token]);

  // Filter all applicants with status "Applied"
  const filteredApplications = allApplications.filter(
    (application) => application.status === "Applied",
  );

  return (
    <>
      <Typography
        component="h1"
        variant="h4"
        align="center"
        color="text.primary"
        gutterBottom
        sx={{ pt: 4 }}
      >
        Students may match you
      </Typography>
      <div className="mt-3 w-5/6  mx-auto h-fit flex flex-col space-y-3 pb-10">
        {filteredApplications.length > 0 ? (
          filteredApplications.map((application: jobApplicationType) => (
            <StudentCard key={application.id} application={application} />
          ))
        ) : (
          <p>Currently you have no waiting candidates</p>
        )}
      </div>
    </>
  );
};

export default StudentList;
