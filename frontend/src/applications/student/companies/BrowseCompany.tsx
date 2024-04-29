import React, { useState } from 'react';
import ContentCard from './ContentCard.component';
import { useQuery } from 'react-query';
import axios from 'axios';
import { getJwtToken } from '../../../shared/utils/authUtils';


const BrowseCompany: React.FC = () => {
  const [allCompanies, setAllCompanies] = useState<companyType[]>([]);
  // Get jwt token
  

  const token = getJwtToken();

  // Fetch all companys
  useQuery({
    queryKey: "allCompanies",
    queryFn: () => axios.get("http://52.163.112.173:4000/api/v1/company", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
    onSuccess: (data) => {
      console.log(data.data);
      setAllCompanies(data.data);
    }
  });


  return (
    <div className="mt-6 w-full h-fit flex flex-col space-y-3 pb-10">
      {allCompanies.length > 0 ? (
        allCompanies.map((company: companyType) => (
          <ContentCard key={company.id} company={company} />
        ))
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default BrowseCompany;
