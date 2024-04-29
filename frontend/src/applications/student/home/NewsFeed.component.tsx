import React, { useState } from 'react';
import ContentCard from './ContentCard.component';
import { useQuery } from 'react-query';
import axios from 'axios';
import { getJwtToken } from '../../../shared/utils/authUtils';

const NewsFeed: React.FC = () => {
  const [allJobs, setAllJobs] = useState<jobType[]>([]);
  const token = getJwtToken();

  // Fetch all jobs
  useQuery({
    queryKey: "allJobs",
    queryFn: () => axios.get("http://52.163.112.173:4000/api/v1/job", {
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
