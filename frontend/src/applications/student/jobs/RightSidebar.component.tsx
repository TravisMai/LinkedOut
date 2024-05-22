import React, { useState } from "react";
import axios from "axios";
import { useQuery } from "react-query";
import { Grid, List, ListItemButton, Typography } from "@mui/material";
import { getJwtToken } from "../../../shared/utils/authUtils";

type jobType = {
  id: string;
  company: {
    id: string;
    name: string;
    email: string;
    avatar: string;
    workField: string;
    address: string;
  };
  title: string;
  image: null;
  salary: null;
  level: string;
  workType: string;
  quantity: number;
  descriptions: {
    aboutUs: string;
    responsibilities: [string];
    requirements: [string];
  };
};

const RightSidebar: React.FC = () => {
  const numberOfRandom = 10;
  const [randomJobs, setRandomJobs] = useState<jobType[]>([]);

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
      console.log(data.data);
      const randomJobs = data.data
        .sort(() => Math.random() - Math.random())
        .slice(0, numberOfRandom);
      setRandomJobs(randomJobs);
    },
  });

  return (
    <div className="pr-5 mx-auto mt-6 pb-6 h-fit lg:min-h-[500px] flex flex-col rounded-xl space-y-2">
      <div className="flex flex-col bg-white rounded-lg items-center">
        <Typography variant="h5" className="pt-4 text-center">
          Discover more jobs
        </Typography>
        <List className="w-11/12 justify-center">
          {randomJobs.length > 0 ? (
            randomJobs.map((job: jobType) => (
              <>
                <ListItemButton
                  className="rounded-xl"
                  href={"/student/jobs/" + job.id}
                >
                  <Grid container spacing={2}>
                    <Grid item xs={2}>
                      <img
                        src={job.company.avatar}
                        className="w-fit h-fit"
                        alt="company avatar"
                      />
                    </Grid>
                    <Grid item xs={10}>
                      <Typography variant="h6">{job.title}</Typography>
                      <Typography variant="body1" color="text.secondary">
                        {job.company.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {job?.descriptions?.aboutUs ?? ""}
                      </Typography>
                    </Grid>
                  </Grid>
                </ListItemButton>
              </>
            ))
          ) : (
            <p>Loading...</p>
          )}
        </List>
      </div>
    </div>
  );
};

export default RightSidebar;
