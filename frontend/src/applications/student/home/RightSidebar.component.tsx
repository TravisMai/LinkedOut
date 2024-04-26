import axios from 'axios';
import React, { useState } from 'react';
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


const RightSidebar: React.FC = () => {

  const [allCompany, setAllCompany] = useState<companyType[]>([]);

  // Get jwt token


  const token = getJwtToken();

  // Fetch all companies
  useQuery({
    queryKey: "allCompany",
    queryFn: () => axios.get("http://localhost:4000/api/v1/company", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
    onSuccess: (data) => {
      console.log(data.data);
      setAllCompany(data.data);
    }
  });


  return (
    <div className="w-4/5 mx-auto my-6 pb-6 h-fit flex flex-col rounded-xl border-2 items-center bg-white">
      <div className='w-full border-b-2 flex justify-evenly'>
        <p className="font-semibold text-xl text-black my-4">
          All company
        </p>
      </div>
      <div className="w-10/12 pt-4">
        <ul className="w-full text-gray-600">
          {allCompany.map((row) => (
            <Link key={row.id} to={`/student/companies/${row.id}`}>
              <li className="h-12 mb-2 flex items-center justify-content cursor-pointer space-x-2 p-2 rounded-md hover:bg-gray-200">
                <img className="w-8 h-8 rounded-full" src={row.avatar} alt="user" />
                <p className="text-sm font-semibold">{row.name}</p>
              </li>
            </Link>
          ))}
        </ul>

      </div>
    </div>
  );
};

export default RightSidebar;
