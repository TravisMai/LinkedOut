import React, { useState } from "react";
import ContentCard from "./ContentCard.component";
import { useQuery } from "react-query";
import axios from "axios";
import { getJwtToken } from "../../../shared/utils/authUtils";
import { Pagination, Stack } from "@mui/material";

const BrowseCompany: React.FC = () => {
  const [allCompanies, setAllCompanies] = useState<companyType[]>([]);

  // Get jwt token
  const token = getJwtToken();

  // Handle pagination
  const itemsPerPage = 4; // Number of items per page

  // State variables for pagination
  const [currentPage, setCurrentPage] = useState(0);

  // Handle page change
  const handlePageChange = (value: number) => {
    setCurrentPage(value);
  };

  // Limit display jobs
  const limitedCompanies = allCompanies.slice(
    itemsPerPage * currentPage,
    itemsPerPage * currentPage + itemsPerPage,
  );

  // Fetch all companys
  useQuery({
    queryKey: "allCompanies",
    queryFn: () =>
      axios.get("https://linkedout-hcmut.feedme.io.vn/api/v1/company", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    onSuccess: (data) => {
      setAllCompanies(data.data);
    },
  });

  return (
    <div className="mt-6 w-full h-fit flex flex-col space-y-3 pb-10">
      {limitedCompanies?.length > 0 ? (
        limitedCompanies?.map((company: companyType) => (
          <ContentCard key={company.id} company={company} />
        ))
      ) : (
        <p>Loading...</p>
      )}
      <div className="w-full mt-2 flex justify-center ">
        <Stack spacing={2}>
          <Pagination
            count={Math.ceil(allCompanies?.length / itemsPerPage)}
            onChange={(_event, value) => handlePageChange(value - 1)}
          />
        </Stack>
      </div>
    </div>
  );
};

export default BrowseCompany;
