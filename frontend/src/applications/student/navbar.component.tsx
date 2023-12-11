import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BellRing, Briefcase, MessagesSquare, Home } from 'lucide-react';
import Logo from "@/shared/assets/LinkedOut-Logo.svg";
import { Tag } from 'antd';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  MinusCircleOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import { useQuery } from 'react-query';
import axios from 'axios';
import { Button } from '@mui/material';

const Navbar: React.FC = () => {
  const [studentEmail, setStudentEmail] = useState("");

  // Fetch for student info
  const getJwtToken = () => {
    return document.cookie.split("; ").find((cookie) => cookie.startsWith("jwtToken="))?.split("=")[1];
  };

  const token = getJwtToken();
  const getStudentInfo = useQuery({
    queryKey: "studentInfo",
    queryFn: () => axios.get("http://localhost:5000/api/v1/student/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  });

  useEffect(() => {
    if (getStudentInfo.isSuccess) {
      setStudentEmail(getStudentInfo.data.data.email);
    }
  }, [getStudentInfo.isSuccess]);

  const location = useLocation();
  const pathName = location?.pathname.split('/')[1];
  return (
    <div className="w-full h-14 bg-white grid grid-cols-7 gap-4 fixed z-50 border-b-2 border-b-slate-200">
      <div className="h-14 col-span-2 grid grid-cols-5 items-center">
        <div className='h-14 col-span-1'>
          <Link to="/">
            <img src={Logo} alt='Home Page' className='h-12 mt-1 mx-auto ml-4 rounded-lg' />
          </Link>
        </div>
        <div className="h-10 col-span-4">
          <input
            placeholder="Search for Jobs, People, and more..."
            className="bg-gray-200 rounded-full w-full h-full focus:outline-none m-auto px-3"
          />
        </div>
      </div>
      <div className="col-span-3 flex items-center justify-evenly">
        <Link to="/student">
          <div className="w-24 h-12 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-100">
            <div className="w-14 h-auto relative flex items-center justify-center">
              <div className=" absolute bg-red-500 text-white text-xs font-bold px-1 rounded-lg top-0 right-0 opacity-70">
                99+
              </div>
              <div
                className={`${pathName === '' || undefined
                  ? 'text-primary'
                  : 'text-gray-400'
                  }`}
              >
                <Home size={30} />
              </div>
            </div>
          </div>
        </Link>
        <Link to="/student/jobs">
          <div className="w-24 h-12 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-100">
            <div className="w-14 h-auto relative flex items-center justify-center">
              <div className="absolute bg-red-500 text-white text-xs font-bold px-1 rounded-lg top-0 right-0 opacity-70">
                99+
              </div>
              <div
                className={`${pathName === 'watch' ? 'text-primary' : 'text-gray-400'
                  }`}
              >
                <Briefcase size={30} />
              </div>
            </div>
          </div>
        </Link>
        <Link to="/student/message">
          <div className="w-24 h-12 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-100">
            <div className="w-14 h-auto relative flex items-center justify-center">
              <div className=" absolute bg-red-500 text-white text-xs font-bold px-1 rounded-lg top-0 right-0 opacity-70">
                99+
              </div>
              <div
                className={`${pathName === 'marketplace' ? 'text-primary' : 'text-gray-400'
                  }`}
              >
                <MessagesSquare size={30} />
              </div>
            </div>
          </div>
        </Link>
        {/* <Link to="/student/notification">
          <div className="w-24 h-12 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-100">
            <div className="w-14 h-auto relative flex items-center justify-center">
              <div className=" absolute bg-red-500 text-white text-xs font-bold px-1 rounded-lg top-0 right-0 opacity-70">
                99+
              </div>
              <div
                className={`${pathName === 'marketplace' ? 'text-primary' : 'text-gray-400'
                  }`}
              >
                <BellRing size={30} />
              </div>
            </div>
          </div>
        </Link> */}
      </div>
      <div className="col-span-2 grid grid-cols-10 items-center justify-end">
        <div className='w-fit col-span-3 items-center mt-1'>
          <Tag icon={<SyncOutlined spin />} color="processing" className='w-full overflow-hidden'>Processing
          </Tag>
        </div>
        <div className="h-10 w-full col-span-7 mx-1 pr-2 ">
          <Link to="/student/profile">
            <button className="mx-4 h-10 px-2 w-fit grid grid-cols-5 space-x-1 items-center focus:outline-none hover:bg-gray-300 rounded-full">
              <p className="overflow-clip col-span-4 text-ellipsis text-sm w-full hover:text-visible">{studentEmail}</p>
              <div>
                <img
                  src="https://img.freepik.com/premium-photo/happy-young-students-studying-college-library-with-stack-books_21730-4486.jpg"
                  className="w-8 h-8 rounded-full col-span-1"
                  alt="dp"
                />
              </div>
            </button>
          </Link>
          {/* <button className="w-10 h-10 bg-gray-200 focus:outline-none hover:bg-gray-300 rounded-full">
            <i className="fas fa-sort-down"></i>
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
