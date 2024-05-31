import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Logo from "@/shared/assets/LinkedOut-Logo.svg";
import {
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { useMutation, useQuery } from "react-query";
import axios from "axios";
import { IconButton, InputBase, Paper, Menu, MenuItem, CardActionArea, Chip } from "@mui/material";
import { getJwtToken } from "../../shared/utils/authUtils";
import {
  ApartmentOutlined,
  BusinessOutlined,
  Check,
  HomeOutlined,
  Search,
  WorkOutline,
} from "@mui/icons-material";
import DefaultAvatar from "@/shared/assets/default-image.jpeg";


type SearchResultsType = {
  entity: string;
  id: string;
  original_search_field: string;
};

type ResponseType = {
  data: any;
};

const Navbar: React.FC = () => {
  const [studentEmail, setStudentEmail] = useState("");
  const [studentVerify, setStudentVerify] = useState(false);
  const [studentActive, setStudentActive] = useState(false);
  const [studentProcess, setStudentProcess] = useState("");
  const [studentAvatar, setStudentAvatar] = useState("");

  // Fetch for student info
  const token = getJwtToken();
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
      setStudentEmail(getStudentInfo.data.data?.email);
      setStudentVerify(getStudentInfo.data.data?.isVerify);
      setStudentActive(getStudentInfo.data.data?.isActive);
      setStudentProcess(getStudentInfo.data.data?.process);
      setStudentAvatar(getStudentInfo.data.data?.avatar);
    }
  }, [
    getStudentInfo.isSuccess,
    getStudentInfo.data?.data.email,
    getStudentInfo.data?.data.isVerify,
    getStudentInfo.data?.data.process,
    getStudentInfo.data?.data.avatar,
  ]);

  const location = useLocation();
  const pathName = location?.pathname.split("/")[1];

  const [searchString, setSearchString] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResultsType[]>([]);
  // Handle searchString change
  const handleSearchStringChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setSearchString(event.target?.value ?? "");
  };

  // Mutation to get search results
  const mutation = useMutation<ResponseType, ErrorType, string>({
    mutationFn: (searchString) => {
      return axios.post(
        `https://linkedout-hcmut.feedme.io.vn/api/v1/app/`,
        { search: searchString },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
    },
    onSuccess: (data) => {
      setSearchResults(data.data?.filter((result: SearchResultsType) => result.entity !== "student"));
    },
    onError: () => {
      // console.log(mutation.error);
    },
  });

  const handleSearch = (e: any) => {
    e.preventDefault();
    // Encode encodeURIComponent
    const encodedString = encodeURIComponent(searchString);
    // Fetch from api
    mutation.mutate(encodedString);
  };

  // Handle search result menu
  const [openMenuSearch, setOpenMenuSearch] = React.useState(false);
  const handleClick = () => {
    setOpenMenuSearch(true);
  };
  const handleClose = () => {
    setOpenMenuSearch(false);
  };

  return (
    <div className="w-full h-14 bg-white grid grid-cols-7 gap-4 fixed z-50 border-b-2 border-b-slate-200">
      <div className="h-14 col-span-2 grid grid-cols-5 items-center">
        <div className="h-14 col-span-1">
          <Link to="/">
            <img
              src={Logo}
              alt="Home Page"
              className="h-12 mt-1 mx-auto ml-4 rounded-lg"
            />
          </Link>
        </div>
        <div className="col-span-4">
          <Paper
            component="form"
            elevation={0}
            variant="outlined"
            sx={{
              display: "flex",
              alignItems: "center",
              width: 400,
              height: "fit",
              backgroundColor: "#eeeeee",
            }}
            onSubmit={handleSearch}
            // anchorPosition here
            name="anchorPosition"
          >
            <Menu
              id="basic-menu"
              open={openMenuSearch}
              onClose={handleClose}
              anchorEl={document.getElementsByName("anchorPosition")[0]}
              // Set max height
              sx={{
                maxHeight: 600,
              }}
            >
              {searchResults?.length > 0 && searchResults?.map ? searchResults?.map((result) => (
                <CardActionArea href={"/student/" + ((result.entity === "job") ? "jobs" : (result.entity === "company") ? "companies" : "") + "/" + result.id}>
                  <MenuItem onClick={handleClose}>
                    {result.entity === "job" ? <>
                      <WorkOutline fontSize="small" sx={{ mr: 1 }} />{"Job "}
                    </> :
                      (result.entity === "company") ? <>
                        <ApartmentOutlined fontSize="small" sx={{ mr: 1 }} />{"Company "}
                      </>
                        : ""}
                    - {result.original_search_field}</MenuItem>
                </CardActionArea>
              )) : (
                <MenuItem>No result found</MenuItem>
              )}
            </Menu>
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder="Search for Jobs, Companies, and more..."
              inputProps={{ "aria-label": "search google maps" }}
              value={searchString}
              onChange={handleSearchStringChange}
            />

            <IconButton
              type="submit"
              sx={{ p: "10px" }}
              aria-label="search"
              onClick={handleClick}
            >
              <Search />
            </IconButton>
          </Paper>

        </div>
      </div>
      <div className="col-span-3 flex items-center justify-evenly">
        <Link to="/student">
          <div className="w-24 h-12 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-100">
            <div className="w-14 h-auto relative flex items-center justify-center">
              <div
                className={`${pathName === "" || undefined
                  ? "text-primary"
                  : "text-gray-400"
                  }`}
              >
                <HomeOutlined fontSize="large" />
              </div>
            </div>
          </div>
        </Link>
        <Link to="/student/jobs">
          <div className="w-24 h-12 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-100">
            <div className="w-14 h-auto relative flex items-center justify-center">
              <div
                className={`${pathName === "watch" ? "text-primary" : "text-gray-400"
                  }`}
              >
                <WorkOutline fontSize="large" />
              </div>
            </div>
          </div>
        </Link>
        <Link to="/student/companies">
          <div className="w-24 h-12 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-100">
            <div className="w-14 h-auto relative flex items-center justify-center">
              <div
                className={`${pathName === "marketplace" ? "text-primary" : "text-gray-400"
                  }`}
              >
                <BusinessOutlined fontSize="large" />
              </div>
            </div>
          </div>
        </Link>
      </div>
      <div className="col-span-2 grid grid-cols-10 items-center justify-end">
        <div className="w-fit col-span-3 items-center mt-1">
          {!studentActive ?
            (<Chip color="error" variant="outlined" icon={<ExclamationCircleOutlined />} label="Deactivated" />)
            : !studentVerify ?
              (<Chip color="warning" variant="outlined" icon={<ExclamationCircleOutlined />} label="Not Verified" />)
              : studentProcess === "Intern" ?
                (<Chip color="success" variant="outlined" icon={<Check />} label="Intern" />)
                : studentProcess === "Registered" ?
                  (<Chip color="primary" variant="outlined" icon={<Check />} label="Enrolled" />)
                  : (<Chip color="primary" variant="outlined" icon={<Check />} label="Verified" />)
          }
        </div>
        <div className="h-10 w-full col-span-7 mx-1 pr-2 ">
          <Link to="/student/profile">
            <button className="mx-4 h-10 px-2 w-fit grid grid-cols-5 space-x-1 items-center focus:outline-none hover:bg-gray-300 rounded-full">
              <p className="overflow-clip col-span-4 text-ellipsis text-sm w-full hover:text-visible">
                {studentEmail}
              </p>
              <div>
                <img
                  src={
                    !studentAvatar?.includes("https://scontent")
                      ? studentAvatar
                      : DefaultAvatar
                      ?? DefaultAvatar
                  }
                  className="w-8 h-8 rounded-full col-span-1"
                  alt="dp"
                />
              </div>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
