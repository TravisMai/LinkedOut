import React, { useState } from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import StudentCard from './StudentCard.component';
import { Typography } from '@mui/material';

type studentType = {
    "id": string,
    "name": string,
    "email": string,
    "phoneNumber": string,
    "avatar": string,
    "isGoogle": boolean,
    "isVerify": boolean,
}


const StudentList: React.FC = () => {
    const [allStudent, setAllStudent] = useState<studentType[]>([]);
    // Get jwt token
    const getJwtToken = () => {
        return document.cookie.split("; ").find((cookie) => cookie.startsWith("jwtToken="))?.split("=")[1];
    };

    const token = getJwtToken();

    // Fetch all students
    useQuery({
        queryKey: "allStudent",
        queryFn: () => axios.get("http://localhost:4000/api/v1/student", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }),
        onSuccess: (data) => {
            console.log(data.data);
            setAllStudent(data.data);
        }
    });


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
            <div className="mt-6 w-5/6  mx-auto h-fit flex flex-col space-y-3 pb-10">
                {allStudent.length > 0 ? (
                    allStudent.map((student: studentType) => (
                        <StudentCard key={student.id} student={student} />
                    ))
                ) : (
                    <p>Loading...</p>
                )}
            </div>
        </>
    );
};

export default StudentList;
