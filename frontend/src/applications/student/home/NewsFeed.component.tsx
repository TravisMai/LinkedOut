import React, { useState } from 'react';
import ContentCard from './ContentCard.component';
import { useQuery } from 'react-query';
import axios from 'axios';
import { getJwtToken } from '../../../shared/utils/authUtils';
import { Pagination, Stack } from '@mui/material';

const NewsFeed: React.FC = () => {
  const [allJobs, setAllJobs] = useState<jobType[]>([]);
  const token = getJwtToken();

  // Handle pagination
  const itemsPerPage = 5; // Number of items per page

  // State variables for pagination
  const [currentPage, setCurrentPage] = useState(0);

  // Handle page change
  const handlePageChange = (value: number) => {
    setCurrentPage(value);
  };

  // Limit display jobs
  const limitedJobs = allJobs.slice(itemsPerPage * currentPage, itemsPerPage * currentPage + itemsPerPage);


  // Fetch all jobs
  useQuery({
    queryKey: "allJobs",
    queryFn: () => axios.get("https://linkedout-hcmut.feedme.io.vn/api/v1/job", {
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
      {limitedJobs.length > 0 ? (
        limitedJobs.map((job: jobType) => (
          <ContentCard key={job.id} job={job} />
        ))
      ) : (
        <p>Loading...</p>
      )}
      <div className='w-full mt-2 flex justify-center '>
        <Stack spacing={2} >
          <Pagination
            count={Math.ceil(allJobs.length / itemsPerPage)}
            onChange={(_event, value) => handlePageChange(value - 1)}
          />
        </Stack>
      </div>
    </div>

  );
};

export default NewsFeed;
