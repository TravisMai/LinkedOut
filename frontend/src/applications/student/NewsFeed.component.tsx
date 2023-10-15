import React, { useState } from 'react';
import ContentCard from './ContentCard.component';
import { useQuery } from 'react-query';
import axios from 'axios';

type jobType = {
  "id": string,
  "company": {
    "id": string,
    "name": string,
    "email": string,
    "avatar": string,
    "workField": string,
    "address": string,
  },
  "title": string,
  "image": null,
  "salary": null,
  "level": string,
  "workType": string,
  "quantity": number,
  "descriptions": {
    "aboutUs": string,
    "responsibilities": [string],
    "requirements": [string],
  }
}


const NewsFeed: React.FC = () => {
  const [allJobs, setAllJobs] = useState<jobType[]>([]);
  // Get jwt token
  const getJwtToken = () => {
    return document.cookie.split("; ").find((cookie) => cookie.startsWith("jwtToken="))?.split("=")[1];
  };

  const token = getJwtToken();

  // Fetch all jobs
  useQuery({
    queryKey: "allJobs",
    queryFn: () => axios.get("http://localhost:5000/api/v1/job", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
    onSuccess: (data) => {
      console.log(data.data);
      setAllJobs(data.data);
    }
  });


  return (
    <div className="mt-6 w-full h-fit flex flex-col space-y-3 pb-10">
      {allJobs.length > 0 ? (
        allJobs.map((job: jobType) => (
          <ContentCard key={job.id} job={job} />
        ))
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default NewsFeed;
