import axios from 'axios';
import React, { useState } from 'react';
import { useQuery } from 'react-query';

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


const RightSidebar: React.FC = () => {

  const [allCompany, setAllCompany] = useState<companyType[]>([]);

  // Get jwt token
  const getJwtToken = () => {
    return document.cookie.split("; ").find((cookie) => cookie.startsWith("jwtToken="))?.split("=")[1];
  };

  const token = getJwtToken();

  // Fetch all companies
  useQuery({
    queryKey: "allCompany",
    queryFn: () => axios.get("http://localhost:5000/api/v1/company", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
    onSuccess: (data) => {
      console.log(data.data);
      setAllCompany(data.data);
    }
  });


  // Generate random images
  const getRandomImage = () => {
    const images = [
      "https://source.unsplash.com/random/?people",
      "https://source.unsplash.com/random/?animals",
      "https://source.unsplash.com/random/?nature",
      "https://source.unsplash.com/random/?water",
      "https://source.unsplash.com/random/?sky",
      "https://source.unsplash.com/random/?mountain",
    ];

    const randomIndex = Math.floor(Math.random() * images.length);
    return images[randomIndex];
  };

  return (
    <div className="w-4/5 mx-auto my-6 pb-6 h-fit flex flex-col rounded-xl border-2 items-center bg-white">
      <div className='w-full border-b-2 flex justify-evenly'>
        <p className="font-semibold text-xl text-black my-4">
          All company
        </p>
      </div>
      <div className="w-10/12 pt-4">
        <ul className="w-full text-gray-600">
          {allCompany
            .map((row, idx) => (
              <li
                key={idx}
                className="h-12 mb-2 flex items-center justify-content cursor-pointer space-x-2 p-2 rounded-md hover:bg-gray-200"
              >
                <img
                  className="w-8 h-8 rounded-full"
                  src={getRandomImage()}
                  alt="user"
                />
                <p className="text-sm font-semibold">{row.name}</p>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default RightSidebar;
