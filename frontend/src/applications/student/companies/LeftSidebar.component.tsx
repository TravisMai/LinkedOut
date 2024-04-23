import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { getJwtToken } from '../../../shared/utils/authUtils';
import { Link } from 'react-router-dom';

type companyType = {
  "id": string,
  "name": string,
  "email": string,
  "phoneNumber": string,
  "avatar": string,
  "workField": string,
  "address": string,
  "website": null,
  "description": string,
  "taxId": null
}


const LeftSidebar: React.FC = () => {

  // Get jwt token

  const token = getJwtToken();

  // Get Student information
  const [studentData, setStudentData] = React.useState<studentType>();
  const getStudentInfo = useQuery({
    queryKey: "studentInfo",
    queryFn: () => axios.get("http://localhost:4000/api/v1/student/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  });
  useEffect(() => {
    if (getStudentInfo.isSuccess) {
      setStudentData(getStudentInfo.data.data);
      // console.log(getStudentInfo.data.data.id)
    }
  }, [getStudentInfo.isSuccess]);

  useEffect(() => {
    if (getStudentInfo.isSuccess && getStudentInfo.data.data.id) {
      setStudentData(getStudentInfo.data.data);
    }
  }, [getStudentInfo.isSuccess]);


  // Get all applied jobs
  const [appliedJobs, setAppliedJobs] = React.useState<jobApplicationType[]>([]);
  const fetchAppliedJobs = (studentId: string) => {
    axios.get(`http://localhost:4000/api/v1/job_applicants/candidate/${studentId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => {
        console.log(response.data);
        setAppliedJobs(response.data);
      })
      .catch(error => {
        console.error("Error fetching applied jobs:", error);
      });
  };

  useEffect(() => {
    if (studentData && studentData.id) {
      fetchAppliedJobs(studentData.id);
    }
  }, [studentData]);

  // Get all different companies (get display 1 for each) from fetech applied jobs
  const [companies, setCompanies] = React.useState<companyType[]>([]);
  useEffect(() => {
    if (appliedJobs.length > 0) {
      const companies = appliedJobs.map(job => job.job.company);
      const uniqueCompanies = Array.from(new Set(companies.map(a => a.id)))
        .map(id => {
          return companies.find(a => a.id === id);
        })
        .filter(company => company !== undefined) as companyType[];
      setCompanies(uniqueCompanies);
    }
  }, [appliedJobs]);



  return (
    <div className="w-4/5 mx-auto my-6 pb-6 h-fit flex flex-col rounded-xl border-2 items-center bg-white">
      <div className='w-full border-b-2 flex justify-evenly'>
        <p className="font-semibold text-xl text-black my-4">
          Connected company
        </p>
      </div>
      <div className="w-10/12 pt-4">
        <ul className="w-full text-gray-600">
          {companies
            .map((row, idx) => (
              <Link to={`/student/companies/${row.id}`}>
                <li
                  key={idx}
                  className="h-12 mb-2 flex items-center justify-content cursor-pointer space-x-2 p-2 rounded-md hover:bg-gray-200"
                // ref={`/student/companies/${row.id}`}
                >
                  <img
                    className="w-8 h-8 rounded-full"
                    src={row.avatar}
                    alt="user"
                  />
                  <p className="text-sm font-semibold">{row.name}</p>
                </li>
              </Link>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default LeftSidebar;