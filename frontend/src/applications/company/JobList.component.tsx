import React, { useState } from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import StudentCard from './StudentCard.component';
import { getJwtToken } from '../../shared/utils/authUtils';

type jobType = {
    "id": string,
    "name": string,
    "email": string,
    "phoneNumber": string,
    "avatar": string,
    "isGoogle": boolean,
    "isVerify": boolean,
}


const JobList: React.FC = () => {
    const [allJobs, setAllJobs] = useState<jobType[]>([]);


    const token = getJwtToken();

    // Fetch all jobs
    // Not authorized, currently not provided
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
            {allJobs.length > 0 ? (
                allJobs.map((student: jobType) => (
                    <StudentCard key={student.id} student={student} />
                ))
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default JobList;
