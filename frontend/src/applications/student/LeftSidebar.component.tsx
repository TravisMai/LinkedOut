import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import DividerWithText from '../../shared/components/DividerWithText';
import { useQuery } from 'react-query';
import axios from 'axios';

const LeftSidebar: React.FC = () => {
  const [showContent, setShowContent] = useState(false);
  const [studentName, setStudentName] = useState("");

  // Fetch for student info
  const getJwtToken = () => {
    return document.cookie.split("; ").find((cookie) => cookie.startsWith("jwtToken="))?.split("=")[1];
  };

  const token = getJwtToken();
    const getStudentInfo = useQuery({
        queryKey: "student",
        queryFn: () => axios.get("http://localhost:5000/api/v1/student/me", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
    });

    useEffect(() => {
        if (getStudentInfo.isSuccess) {
            setStudentName(getStudentInfo.data.data.name);
        }
    }, [getStudentInfo.isSuccess]);


  const toggleContent = () => {
    setShowContent(!showContent);
  };
  return (
    <div className="w-4/5 mx-auto mt-6 pb-6 h-fit lg:min-h-[500px] flex flex-col rounded-xl space-y-2">
      <div className='flex flex-col bg-white rounded-lg '>
        <div className='flex flex-col'>
          <img
            src="https://source.unsplash.com/random?wallpapers"
            className="w-full h-24 rounded-t-lg"
          />
          <img
            src="https://scontent.fsgn14-1.fna.fbcdn.net/v/t1.18169-9/22046122_1959802640904562_1679173393777949798_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=8bfeb9&_nc_ohc=17jWHmJVCOIAX8SbNDi&_nc_ht=scontent.fsgn14-1.fna&oh=00_AfAcQzj3E28SiqhowMcyP7WVDtXROeacJHY4MbRisThGSw&oe=652F4283"
            className=" w-20 h-20 lg:w-36 lg:h-36 rounded-full mx-auto my-3 -mt-10 lg:-mt-16 border-2 border-white"
          />
        </div>
        <h1 className='mx-auto font-semibold text-base lg:text-2xl text-black pb-5'>{studentName}</h1>
      </div>
      <div className={`w-full border-b-4 bg-white rounded-lg border-[#f3f2f0] lg:flex lg:flex-col items-center justify-center py-6 ${showContent ? 'block' : 'hidden'}`}>
        <h1 className='mx-auto text-lg text-black'>MSSV: 19521382</h1>
        <h1 className='mx-auto text-lg text-black'>Khoa: Công nghệ thông tin</h1>
        <h1 className='mx-auto text-lg text-black'>Lớp: 19CTT3</h1>
        <h1 className='mx-auto text-lg text-black'>Chuyên ngành: Kỹ thuật phần mềm</h1>
        <h1 className='mx-auto text-lg text-black'>Điểm trung bình: 3.5</h1>
      </div>
      {!showContent && (
        <Button variant="text" className="lg:invisible text-center mt-2" onClick={toggleContent}>
          <DividerWithText
            text='Show more'
            muiElementIcon={<KeyboardArrowDownIcon />}
          />
        </Button>
      )}
      {showContent && (
        <Button variant="text" className="lg:invisible text-center mt-2" onClick={toggleContent}>
          <DividerWithText
            text='Show less'
            muiElementIcon={<KeyboardArrowUpIcon />}
          />
        </Button>
      )}
    </div>
  );
};

export default LeftSidebar;
