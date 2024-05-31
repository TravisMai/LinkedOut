import axios from "axios";
import React, { useCallback, useEffect } from "react";
import { useQuery } from "react-query";
import { getJwtToken } from "../../../shared/utils/authUtils";
import { Link } from "react-router-dom";
import { Typography } from "@mui/material";
import DefaultAvatar from "@/shared/assets/default-image.jpeg";

const LeftSidebar: React.FC = () => {
  // Get jwt token

  const token = getJwtToken();

  // Get Student information
  const [studentData, setStudentData] = React.useState<studentType>();
  const getStudentInfo = useQuery({
    queryKey: "studentInfo",
    queryFn: () =>
      axios.get("https://linkedout-hcmut.feedme.io.vn/api/v1/student/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
  });
  useEffect(() => {
    if (getStudentInfo.isSuccess) {
      setStudentData(getStudentInfo.data?.data);
    }
  }, [getStudentInfo.isSuccess, getStudentInfo.data?.data]);

  useEffect(() => {
    if (getStudentInfo.isSuccess && getStudentInfo.data?.data.id) {
      setStudentData(getStudentInfo.data?.data);
    }
  }, [getStudentInfo.isSuccess, getStudentInfo.data?.data]);

  // Get all applied jobs
  const [appliedJobs, setAppliedJobs] = React.useState<jobApplicationType[]>(
    [],
  );

  // Wrap fetchAppliedJobs in useCallback
  const fetchAppliedJobs = useCallback(
    (studentId: string) => {
      axios
        .get(
          `https://linkedout-hcmut.feedme.io.vn/api/v1/job_applicants/candidate/${studentId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )
        .then((response) => {
          setAppliedJobs(response.data);
        })
        .catch((error) => {
          // console.error("Error fetching applied jobs:", error);
        });
    },
    [token], // Make sure to add token as dependency
  );

  useEffect(() => {
    if (studentData && studentData.id) {
      fetchAppliedJobs(studentData.id);
    }
  }, [studentData, fetchAppliedJobs]); // Include fetchAppliedJobs

  // Get all different companies from the applied jobs
  const companies = appliedJobs
    ?.map((job) => job.job.company)
    ?.filter(
      (company, index, self) =>
        index === self.findIndex((t) => t.id === company.id),
    );


  return (
    <div className="w-4/5 mx-auto my-6 pb-6 h-fit flex flex-col rounded-lg border-2 items-center bg-white">
      <div className="w-full border-b-2 flex justify-evenly">
        <p className="font-semibold text-xl text-black my-4">
          Connected company
        </p>
      </div>
      <div className="w-10/12 pt-4">
        <ul className="w-full text-gray-600">
          {companies?.length > 0 ? (
            companies?.map((row, idx) => (
              <Link to={`/student/companies/${row.id}`}>
                <li
                  key={idx}
                  className="h-12 mb-2 flex items-center justify-content cursor-pointer space-x-2 p-2 rounded-md hover:bg-gray-200"
                // ref={`/student/companies/${row.id}`}
                >
                  <img
                    className="w-8 h-8 rounded-full"
                    src={
                      !row?.avatar?.includes("https://scontent")
                        ? row?.avatar
                        : DefaultAvatar
                        ?? DefaultAvatar
                    }
                    alt="user"
                  />
                  <p className="text-sm font-semibold">{row.name}</p>
                </li>
              </Link>
            ))
          ) : (
            <Typography className="text-center">
              No company connected
            </Typography>
          )}
        </ul>
      </div>
    </div>
  );
};

export default LeftSidebar;
