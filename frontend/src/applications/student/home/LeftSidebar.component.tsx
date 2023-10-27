import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import DividerWithText from '../../../shared/components/DividerWithText';
import { useMutation, useQuery } from 'react-query';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

type ResponeType = {
  data: {
    student: {
      id: string;
      name: string;
      email: string;
      phoneNumber: string;
      avatar: string;
      isGoogle: boolean;
      isVerify: boolean;
    };
    token: string;
  };
}

type ErrorType = {
  response: {
    data: {
      message: string;
    }
  }
}

const LeftSidebar: React.FC = () => {
  const navigate = useNavigate();
  const [showContent, setShowContent] = useState(false);
  const [studentName, setStudentName] = useState("");

  // Fetch for student info
  const getJwtToken = () => {
    return document.cookie.split("; ").find((cookie) => cookie.startsWith("jwtToken="))?.split("=")[1];
  };

  const token = getJwtToken();

  // Fetch student info
  useQuery({
    queryKey: "student",
    queryFn: () => axios.get("http://localhost:5000/api/v1/student/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
    onSuccess: (data) => {
      setStudentName(data.data.name);
    }
  });


  // Mutation to logout
  const mutation = useMutation<ResponeType, ErrorType>({
    mutationFn: () => axios.post("http://localhost:5000/api/v1/student/logout", {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
    onSuccess: () => {
      document.cookie = `jwtToken=; expires=${new Date(Date.now() - 60 * 60 * 1000)}; path=/`;
      // Delete cookie

      console.log("Logout successfully");
      // setSending(false);
      // setShowError(false);
      // setShowSuccess(true);
      setTimeout(() => {
        // setShowSuccess(false); // Hide the success message
        navigate('/'); // Navigate to the next screen
      }, 1000);
    },
    onError: (error) => {
      // setSending(false);
      // setShowError(true);
      console.log("Logout failed");
      console.log(error);
    },
    onMutate: () => {
      console.log(token);
      // setSending(true);
      // setShowError(false);
    }
  }
  );


  const handleLogout = () => {
    mutation.mutate();
  }

  // Toggle show more/less
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
            src="https://media.licdn.com/dms/image/D5603AQE5blAsuMMong/profile-displayphoto-shrink_800_800/0/1687611208998?e=1703721600&v=beta&t=QujDAtWLKuAbw0PoP4OJat_t8UlD9CzuK_BpNNSnXHc"
            className=" w-20 h-20 lg:w-36 lg:h-36 rounded-full mx-auto my-3 -mt-10 lg:-mt-16 border-2 border-white"
          />
        </div>
        <h1 className='mx-auto font-semibold text-base lg:text-2xl text-black pb-5'>{token? studentName: <div>Not Logged In</div>}</h1>
      </div>
      <div className={`w-full border-b-4 bg-white rounded-lg border-[#f3f2f0] lg:flex lg:flex-col items-center justify-center py-6 ${showContent ? 'block' : 'hidden'}`}>
        <h1 className='mx-auto text-lg text-black'>MSSV: 2052508</h1>
        <h1 className='mx-auto text-lg text-black'>Khoa: Khoa học và Kỹ thuật Máy tính</h1>
        <h1 className='mx-auto text-lg text-black'>Ngành: Kỹ thuật Máy tính</h1>
        <h1 className='mx-auto text-lg text-black'>Lớp: CC20KTM1</h1>
        <h1 className='mx-auto text-lg text-black'>Điểm trung bình: 8.51</h1>
        {/* <Button sx={{ mt: 2 }} variant="outlined" color="error" onClick={handleLogout}>
          Log out
        </Button> */}
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
