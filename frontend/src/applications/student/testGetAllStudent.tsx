import axios from "axios";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";

export default function TestGet() {
    const [student, setStudent] = useState({
        id: '',
        name: '',
        email: '',
        phoneNumber: '',
        avatar: '',
        isGoogle: false,
        isVerify: false,
    });
    const getJwtToken = () => {
        return document.cookie.split("; ").find((cookie) => cookie.startsWith("jwtToken="))?.split("=")[1];
    };

    const token = getJwtToken();
    const getStudentList = useQuery({
        queryKey: "studentList",
        queryFn: () => axios.get("http://localhost:5000/api/v1/student/me", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
    });

    useEffect(() => {
        if (getStudentList.isSuccess) {
            console.log(getStudentList.data.data);
            setStudent(getStudentList.data.data);
        }
    }, [getStudentList.isSuccess]);

    return (

        <div>
            <div>
                ID: {student.id}
            </div>
            <div>
                Name: {student.name}
            </div>
            <div>
                Email: {student.email}
            </div>
        </div>
    );
}
