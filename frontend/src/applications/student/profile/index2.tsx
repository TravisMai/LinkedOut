import {
  AccountCircle,
  CalendarMonth,
  Check,
  Email,
  Launch,
  Phone,
  Star,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Checkbox,
  Chip,
  Container,
  Grid,
  IconButton,
  List,
  ListItem,
  Paper,
  Typography,
} from "@mui/material";
import React from "react";
import FormDialog from "./update/updateDialog.component";
import PhotoDialog from "./update/updateDialog.component";
import { useMutation } from "react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getJwtToken } from "../../../shared/utils/authUtils";

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
};

type ErrorType = {
  response: {
    data: {
      message: string;
    };
  };
};

const data = {
  name: "Tran Tri Dat",
  email: "dat.trantri2002@hcmut.edu.vn",
  phone: "0123456789",
  major: "Computer Engineering",
  year: "2020",
  avatar:
    "https://img.freepik.com/premium-photo/happy-young-students-studying-college-library-with-stack-books_21730-4486.jpg",
  socialMedia: {
    github: "https://www.github.com/",
    linkedin: "https://www.linkedin.com/",
  },
  objective:
    "Pursuing the role Software Engineer with a focus on using cloud technology as well as apply machine learning models to solve complex business problems. As a final-year Computer Science student, with some knowledge in cloud computing, and some experience in apply machine learning models in projects.",
  education: [
    {
      school: "Ho Chi Minh City University of Technology",
      major: "Computer Engineering",
      startTime: "Sep 2020 ",
      endTime: "Present",
      gpa: "8.8",
    },
    {
      school: "Le Hong Phong High School for the Gifted",
      major: "Chemistry",
      startTime: "Sep 2017 ",
      endTime: "Jun 2020",
      gpa: "8.8",
    },
  ],
  workingHistory: [
    {
      company: "ABC",
      position: "Software Engineer",
      time: "Sep 2020 - Present",
      task: "Developed and maintained custom websites and web applications using HTML, CSS, JavaScript, and PHP. Collaborated with clients and designers to ensure project accuracy and completed projects on time.",
    },
    {
      company: "ABC",
      position: "Software Engineer",
      time: "Sep 2016 - Sep 2017",
      task: "Developed and maintained custom websites and web applications using HTML, CSS, JavaScript, and PHP.",
    },
  ],
  certificate: [
    {
      name: "Azure Administrator Associate",
      time: "Sep 2020",
    },
    {
      name: "AWS Certified Cloud Practitioner",
      time: "Sep 2020",
    },
  ],
  skill: [
    {
      name: "Python",
      level: "80",
    },
    {
      name: "Java",
      level: "70",
    },
    {
      name: "C++",
      level: "60",
    },
    {
      name: "C#",
      level: "50",
    },
    {
      name: "HTML",
      level: "80",
    },
    {
      name: "CSS",
      level: "70",
    },
    {
      name: "JavaScript",
      level: "60",
    },
    {
      name: "PHP",
      level: "50",
    },
    {
      name: "ReactJS",
      level: "80",
    },
    {
      name: "VueJS",
      level: "70",
    },
    {
      name: "AngularJS",
      level: "60",
    },
    {
      name: "NodeJS",
      level: "50",
    },
    {
      name: "MySQL",
      level: "80",
    },
    {
      name: "MongoDB",
      level: "70",
    },
    {
      name: "Firebase",
      level: "60",
    },
    {
      name: "Azure",
      level: "50",
    },
    {
      name: "AWS",
      level: "80",
    },
    {
      name: "GCP",
      level: "70",
    },
    {
      name: "Machine Learning",
      level: "60",
    },
    {
      name: "Deep Learning",
      level: "50",
    },
    {
      name: "Computer Vision",
      level: "80",
    },
    {
      name: "Natural Language Processing",
      level: "70",
    },
    {
      name: "Data Analysis",
      level: "60",
    },
    {
      name: "Data Visualization",
      level: "50",
    },
  ],
  additionalInformation: [
    {
      name: "English",
      level: "IELTS 6.5",
    },
    {
      name: "Japanese",
      level: "N5",
    },
    {
      name: "Chinese",
      level: "HKS4",
    },
  ],
  reference: [
    {
      name: "Sarah Lee (Former Manager)",
      email: "sarahlee@email.com",
      phone: "0123456789",
    },
  ],
};

export default function StudentProfile2() {
  const navigate = useNavigate();
  const [openInfo, setOpenInfo] = React.useState(false);
  const handleOpenRequest = () => {
    setOpenInfo(true);
  };
  const handleCloseRequest = () => {
    setOpenInfo(false);
  };
  const [openPhoto, setOpenPhoto] = React.useState(false);
  const handleOpenUpload = () => {
    setOpenPhoto(true);
  };
  const handleCloseUpload = () => {
    setOpenPhoto(false);
  };

  const token = getJwtToken();
  // Mutation to logout
  const mutation = useMutation<ResponeType, ErrorType>({
    mutationFn: () =>
      axios.post(
        "https://linkedout-hcmut.feedme.io.vn/api/v1/student/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      ),
    onSuccess: () => {
      // Delete cookie
      document.cookie = `jwtToken=; expires=${new Date(Date.now() - 60 * 60 * 1000)}; path=/`;
      setTimeout(() => {
        navigate("/");
      }, 1000);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const handleLogout = () => {
    mutation.mutate();
  };

  return (
    <Grid container spacing={2} className="bg-[#f3f2f0] min-h-screen">
      <Grid item xs={3}>
        <Container
          disableGutters={true}
          sx={{
            width: 9 / 10,
            bgcolor: "white",
            display: "flex",
            flexDirection: "column",
            gap: 2,
            borderRadius: 3,
            my: 3,
            pb: 3,
          }}
        >
          <Container
            disableGutters={true}
            sx={{
              alignContent: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 1,
            }}
          >
            <img
              src={data.avatar}
              className=" w-full  rounded-t-xl mx-auto  border-2 border-blue-300"
            />
            <Button
              variant="outlined"
              sx={{ mt: 1 }}
              size="small"
              onClick={handleOpenUpload}
            >
              Change photo
            </Button>
            <Chip color="success" icon={<Check />} label="Verified" />
          </Container>

          <Typography variant="body2" className="pl-5">
            {" "}
            <AccountCircle /> Name:{" "}
            <span className="font-bold">{data.name} </span>{" "}
          </Typography>
          <Typography variant="body2" className="pl-5">
            <Email /> Email: <span className="font-bold">{data.email} </span>
          </Typography>
          <Typography variant="body2" className="pl-5">
            <Phone /> Phone: <span className="font-bold">{data.phone} </span>
          </Typography>
          <Typography variant="body2" className="pl-5">
            <Star /> Major: <span className="font-bold">{data.major} </span>
          </Typography>
          <Typography variant="body2" className="pl-5">
            <CalendarMonth /> Year:{" "}
            <span className="font-bold">{data.year} </span>
          </Typography>
          <Container
            disableGutters={true}
            sx={{
              alignContent: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Button
              variant="outlined"
              color="warning"
              sx={{}}
              size="small"
              onClick={handleOpenRequest}
            >
              Request to change information{" "}
            </Button>
          </Container>
        </Container>
      </Grid>
      <Grid item xs={8.8}>
        <Container
          disableGutters={true}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            borderRadius: 3,
            my: 3,
            pb: 3,
          }}
        >
          <Button
            href="/student/profile/update"
            variant="contained"
            color="primary"
            sx={{ mt: 1, width: 1 / 6 }}
            size="small"
            disabled
          >
            Update
          </Button>
          <Paper>
            <Box sx={{ display: "flex", alignItems: "left", pl: 2, pt: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Internship Process
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ pb: 2 }}>
              <List>
                <ListItem>
                  <Checkbox disabled checked />
                  <Typography
                    variant="body1"
                    sx={{
                      textDecoration: "line-through",
                      color: "gray",
                      fontStyle: "italic",
                    }}
                  >
                    Internship Course Registered
                  </Typography>
                </ListItem>
                <ListItem>
                  <Checkbox disabled checked />
                  <Typography
                    variant="body1"
                    sx={{
                      textDecoration: "line-through",
                      color: "gray",
                      fontStyle: "italic",
                    }}
                  >
                    Foundation test
                  </Typography>
                </ListItem>
                <ListItem>
                  <Checkbox disabled checked />
                  <Typography
                    variant="body1"
                    sx={{
                      textDecoration: "line-through",
                      color: "gray",
                      fontStyle: "italic",
                    }}
                  >
                    Apply for Internship
                  </Typography>
                </ListItem>
                <ListItem>
                  <Checkbox disabled />
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "left",
                    }}
                  >
                    <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                      Internship
                    </Typography>
                    <Typography>ABC Company</Typography>
                  </Box>
                  <IconButton aria-label="delete">
                    <Launch />
                  </IconButton>
                </ListItem>
                <ListItem>
                  <Checkbox disabled />
                  <Typography variant="body1" sx={{}}>
                    Internship Report
                  </Typography>
                </ListItem>
              </List>
            </Typography>
          </Paper>
          <Button
            variant="outlined"
            color="error"
            sx={{ mt: 1, width: 1 / 5 }}
            size="small"
            onClick={handleLogout}
          >
            Logout
          </Button>
          <FormDialog
            state={openInfo}
            onClose={handleCloseRequest}
            field={""}
            onExit={function (): void {
              throw new Error("Function not implemented.");
            }}
          />
          <PhotoDialog
            state={openPhoto}
            onClose={handleCloseUpload}
            field={""}
            onExit={function (): void {
              throw new Error("Function not implemented.");
            }}
          />
        </Container>
      </Grid>
    </Grid>
  );
}
