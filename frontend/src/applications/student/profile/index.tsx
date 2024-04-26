import { AccountCircle, CalendarMonth, Check, Code, Create, Edit, Email, GitHub, Group, LinkedIn, More, Phone, School, Star, WorkHistory, WorkspacePremium, Fingerprint, Facebook, Google, Twitter, AttachFile } from "@mui/icons-material";
import { Box, Button, Chip, Container, Grid, IconButton, Link, List, ListItem, ListItemIcon, ListItemText, Paper, Typography } from "@mui/material";
import React, { useEffect } from "react";
import {
    ExclamationCircleOutlined,
} from '@ant-design/icons';
import { getJwtToken } from "../../../shared/utils/authUtils";
import { useMutation, useQuery } from "react-query";
import axios from "axios";
import UpdateDialog from "./update/updateDialog.component";
import { useNavigate } from "react-router-dom";


const data = {
    name: "Tran Tri Dat",
    email: "dat.trantri2002@hcmut.edu.vn",
    phone: "0123456789",
    major: "Computer Engineering",
    year: "2020",
    avatar: "https://img.freepik.com/premium-photo/happy-young-students-studying-college-library-with-stack-books_21730-4486.jpg",
    socialMedia:
    {
        github: "https://www.github.com/",
        linkedin: "https://www.linkedin.com/",
    },
    objective: "Pursuing the role Software Engineer with a focus on using cloud technology as well as apply machine learning models to solve complex business problems. As a final-year Computer Science student, with some knowledge in cloud computing, and some experience in apply machine learning models in projects.",
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
        }
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
        }
    ],
    certificate: [
        {
            name: "Azure Administrator Associate",
            time: "Sep 2020",
        },
        {
            name: "AWS Certified Cloud Practitioner",
            time: "Sep 2020",
        }
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
        }
    ],
}

type ResponseType = {
    data: {}
}


export default function StudentProfile() {
    const navigate = useNavigate();


    // Fetch for student info
    const token = getJwtToken();


    const [studentData, setStudentData] = React.useState<studentType>([]);


    const getStudentInfo = useQuery({
        queryKey: "studentInfo",
        queryFn: () => axios.get("http://localhost:4000/api/v1/student/me", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
    });

    useEffect(() => {
        if (getStudentInfo.isSuccess) {
            setStudentData(getStudentInfo.data.data);
        }
    }, [getStudentInfo.isSuccess]);

    const [updateField, setUpdateField] = React.useState("");

    const [openDialog, setOpenDialog] = React.useState(false);
    const handleOpenDialog = (field: string) => {
        setOpenDialog(true);
        setUpdateField(field);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        // Force the page to reload
        window.location.reload();
        // Forece refetch the data
        // getStudentInfo.refetch();
    }

    const handleExit = () => {
        setOpenDialog(false);
    }


    // Logout
    // Mutation to logout
    const mutation = useMutation<ResponseType, ErrorType>({
        mutationFn: () => axios.post("http://localhost:4000/api/v1/student/logout", {}, {
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

    return (
        <Grid container spacing={2} className='bg-[#f3f2f0] min-h-screen'>
            <Grid item xs={3}>
                <Container disableGutters="true"
                    sx={{ width: 9 / 10, bgcolor: "white", display: "flex", flexDirection: "column", gap: 2, borderRadius: 3, my: 3, pb: 3 }}>
                    <Container disableGutters="true"
                        sx={{
                            alignContent: "center",
                            display: 'flex',
                            flexDirection: "column",
                            alignItems: "center",
                            gap: 1,
                        }} >
                        <img
                            src={`${studentData.avatar}`} // Append a unique query parameter to bypass browser caching
                            className=" w-full  rounded-t-xl mx-auto  border-2 border-blue-300"
                        />
                        <Button variant="outlined" sx={{ mt: 1 }} size="small" onClick={() => handleOpenDialog("avatar")}>Change photo</Button>
                        {studentData.isVerify ? <Chip color="success" icon={<Check />} label="Verified" /> : <Chip color="warning" icon={<ExclamationCircleOutlined />} label="Not Verified" />}
                        {/* <Chip color="success" icon={<Check />} label="Verified" /> */}

                    </Container>

                    <Typography variant="body2" className='pl-5'> <AccountCircle /> Name: <span className="font-bold">{studentData.name} </span> </Typography>
                    <Typography variant="body2" className='pl-5'><Fingerprint /> Student ID: <span className="font-bold">{studentData.studentId} </span></Typography>
                    <Typography variant="body2" className='pl-5'><Email /> Email: <span className="font-bold">{studentData.email} </span></Typography>
                    <Typography variant="body2" className='pl-5'><Phone /> Phone: <span className="font-bold">{studentData.phoneNumber} </span></Typography>
                    <Typography variant="body2" className='pl-5'><Star /> Major: <span className="font-bold">{studentData.major} </span></Typography>
                    <Typography variant="body2" className='pl-5'><CalendarMonth /> Year: <span className="font-bold">{studentData.year} </span></Typography>
                    <Container disableGutters="true"
                        sx={{
                            alignContent: "center",
                            display: 'flex',
                            flexDirection: "column",
                            alignItems: "center",
                        }} >
                        <Button variant="outlined" color="warning" sx={{}} onClick={handleLogout} size="large">Logout</Button>
                    </Container>
                </Container>
            </Grid>
            <Grid item xs={8.8}>
                <Container disableGutters="true"
                    sx={{ display: "flex", flexDirection: "column", gap: 2, borderRadius: 3, my: 3, pb: 3 }}>
                    {/* Resume */}
                    <Paper>
                        <Box sx={{ display: 'flex', alignItems: 'left', pl: 2, pt: 2, pb: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                Résumé
                            </Typography>
                            <IconButton size="small" onClick={() => handleOpenDialog("resume")}><Edit /></IconButton>
                        </Box>
                        <Typography variant="body2" sx={{ pl: 2, pb: 2 }}>
                            <List>
                                {studentData.resume ? studentData.resume.map((item) => (
                                    <ListItem>
                                        <ListItemIcon><AttachFile /></ListItemIcon>
                                        <Link href={item.url}>
                                            <ListItemText
                                                primary={"This is a random id: " + item.id} 
                                            />
                                        </Link>
                                    </ListItem>

                                )) : <></>}
                            </List>
                        </Typography>
                    </Paper>
                    {/* Social media */}
                    <Paper>
                        <Box sx={{ display: 'flex', alignItems: 'left', pl: 2, pt: 2, pb: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                Social Media
                            </Typography>
                            <IconButton size="small" onClick={() => handleOpenDialog("socialMedia")}><Edit /></IconButton>

                        </Box>
                        <Typography variant="body2" sx={{ pl: 2, pb: 2 }}>
                            <List>
                                {studentData.socialMedia?.github ?
                                    <ListItem>
                                        <ListItemIcon><GitHub /></ListItemIcon>
                                        <Link href={studentData.socialMedia?.github} target="_blank">{studentData.socialMedia?.github}</Link>
                                    </ListItem>
                                    : <></>
                                }
                                {studentData.socialMedia?.linkedin ?
                                    <ListItem>
                                        <ListItemIcon><LinkedIn /></ListItemIcon>
                                        <Link href={studentData.socialMedia?.linkedin} target="_blank">{studentData.socialMedia?.linkedin}</Link>
                                    </ListItem>
                                    : <></>
                                }
                                {studentData.socialMedia?.facebook ?
                                    <ListItem>
                                        <ListItemIcon><Facebook /></ListItemIcon>
                                        <Link href={studentData.socialMedia?.facebook} target="_blank">{studentData.socialMedia?.facebook}</Link>
                                    </ListItem>
                                    : <></>
                                }
                                {studentData.socialMedia?.google ?
                                    <ListItem>
                                        <ListItemIcon><Google /></ListItemIcon>
                                        <Link href={studentData.socialMedia?.google} target="_blank">{studentData.socialMedia?.google}</Link>
                                    </ListItem>
                                    : <></>
                                }
                                {studentData.socialMedia?.twitter ?
                                    <ListItem>
                                        <ListItemIcon><Twitter /></ListItemIcon>
                                        <Link href={studentData.socialMedia?.twitter} target="_blank">{studentData.socialMedia?.twitter}</Link>
                                    </ListItem>
                                    : <></>
                                }

                            </List>
                        </Typography>
                    </Paper>
                    {/* Objective */}
                    <Paper>
                        <Box sx={{ display: 'flex', alignItems: 'left', pl: 2, pt: 2, pb: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                Objective
                            </Typography>
                            <IconButton size="small" onClick={() => handleOpenDialog("objective")}><Edit /></IconButton>
                        </Box>
                        <Typography variant="body2" sx={{ pl: 2, pb: 2 }}>
                            {studentData.objective}
                        </Typography>
                    </Paper>
                    {/* Education */}
                    <Paper>
                        <Box sx={{ display: 'flex', alignItems: 'left', pl: 2, pt: 2, pb: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                Education
                            </Typography>
                            <IconButton size="small" onClick={() => handleOpenDialog("education")}><Edit /></IconButton>
                        </Box>
                        <Typography variant="body2" sx={{ pl: 2, pb: 2 }}>
                            <List>
                                {studentData.education ? studentData.education.map((item) => (
                                    <ListItem>
                                        <ListItemIcon><School /></ListItemIcon>
                                        <ListItemText
                                            primary={item.school}
                                            secondary={
                                                <React.Fragment>
                                                    {item.major &&
                                                        <Typography variant="body1">
                                                            {item.major}
                                                        </Typography>
                                                    }
                                                    {item.startTime &&
                                                        <Typography>
                                                            {item.startTime} - {item.endTime ? item.endTime : "Present"}
                                                        </Typography>
                                                    }
                                                    {item.gpa &&
                                                        <Typography>
                                                            GPA: {item.gpa}
                                                        </Typography>
                                                    }
                                                </React.Fragment>
                                            }
                                        />
                                    </ListItem>

                                )) : <></>}
                            </List>
                        </Typography>
                    </Paper>
                    {/* Working History */}
                    <Paper>
                        <Box sx={{ display: 'flex', alignItems: 'left', pl: 2, pt: 2, pb: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                Working History
                            </Typography>
                            <IconButton size="small" onClick={() => handleOpenDialog("workingHistory")}><Edit /></IconButton>
                        </Box>
                        <Typography variant="body2" sx={{ pl: 2, pb: 2 }}>
                            <List>
                                {studentData.workingHistory ? studentData.workingHistory.map((item) => (
                                    <ListItem>
                                        <ListItemIcon><WorkHistory /></ListItemIcon>
                                        <ListItemText
                                            primary={item.company}

                                            secondary={
                                                <React.Fragment>
                                                    {item.time &&
                                                        <Typography variant="body1">
                                                            {item.time}
                                                        </Typography>
                                                    }
                                                    {item.position &&
                                                        <Typography>
                                                            Role: {item.position}
                                                        </Typography>
                                                    }
                                                    {item.task &&
                                                        <Typography>
                                                            Responsibilities: {item.task}
                                                        </Typography>
                                                    }
                                                </React.Fragment>
                                            }
                                        />
                                    </ListItem>

                                )) : <></>}
                            </List>
                        </Typography>
                    </Paper>
                    {/* Certificate */}
                    <Paper>
                        <Box sx={{ display: 'flex', alignItems: 'left', pl: 2, pt: 2, pb: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                Certificate
                            </Typography>
                            <IconButton size="small" onClick={() => handleOpenDialog("certificate")}><Edit /></IconButton>
                        </Box>
                        <Typography variant="body2" sx={{ pl: 2, pb: 2 }}>
                            <List>
                                {studentData.certificate ? studentData.certificate.map((item) => (
                                    <ListItem>
                                        <ListItemIcon><WorkspacePremium /></ListItemIcon>
                                        <ListItemText
                                            primary={item.name}
                                            secondary={
                                                <React.Fragment>
                                                    <Typography variant="body1">
                                                        {item.issuedBy}
                                                    </Typography>
                                                    <Typography variant="body1">
                                                        {item.time}
                                                    </Typography>

                                                </React.Fragment>
                                            }
                                        />
                                    </ListItem>

                                )) : <></>}
                            </List>
                        </Typography>
                    </Paper>
                    {/* Skill */}
                    <Paper>
                        <Box sx={{ display: 'flex', alignItems: 'left', pl: 2, pt: 2, pb: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                Skills
                            </Typography>
                            <IconButton size="small" onClick={() => handleOpenDialog("skill")}><Edit /></IconButton>
                        </Box>
                        <Typography variant="body2" sx={{ pl: 2, pb: 2 }}>
                            <List>
                                {studentData.skill ? studentData.skill.map((item) => (
                                    <ListItem>
                                        <ListItemIcon><Star /></ListItemIcon>
                                        <ListItemText
                                            secondary={
                                                <React.Fragment>
                                                    <Typography variant="body1">
                                                        {item.name} {item.level && <> - {item.level}</>}
                                                    </Typography>

                                                </React.Fragment>
                                            }
                                        />
                                    </ListItem>
                                )) : <></>}
                            </List>
                        </Typography>
                    </Paper>
                    {/* Additional Information */}
                    <Paper>
                        <Box sx={{ display: 'flex', alignItems: 'left', pl: 2, pt: 2, pb: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                Additional Information
                            </Typography>
                            <IconButton size="small" onClick={() => handleOpenDialog("additionalInformation")}><Edit /></IconButton>
                        </Box>
                        <Typography variant="body2" sx={{ pl: 2, pb: 2 }}>
                            <List>
                                {studentData.additionalInformation ? studentData.additionalInformation.map((item) => (
                                    <ListItem>
                                        <ListItemIcon><More /></ListItemIcon>
                                        <ListItemText
                                            primary={item.name}
                                            secondary={
                                                <React.Fragment>
                                                    <Typography variant="body1">
                                                        {item.level}
                                                    </Typography>
                                                </React.Fragment>
                                            }
                                        />
                                    </ListItem>

                                )) : <></>}
                            </List>
                        </Typography>
                    </Paper>
                    {/* Reference */}
                    <Paper>
                        <Box sx={{ display: 'flex', alignItems: 'left', pl: 2, pt: 2, pb: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                Reference
                            </Typography>
                            <IconButton size="small" onClick={() => handleOpenDialog("reference")}><Edit /></IconButton>
                        </Box>
                        <Typography variant="body2" sx={{ pl: 2, pb: 2 }}>
                            <List>
                                {studentData.reference ? studentData.reference.map((item) => (
                                    <ListItem>
                                        <ListItemIcon><Group /></ListItemIcon>
                                        <ListItemText
                                            primary={item.name}
                                            secondary={
                                                <React.Fragment>
                                                    {item.email &&
                                                        <Typography variant="body1">
                                                            Email: {item.email}
                                                        </Typography>
                                                    }
                                                    {item.phone &&
                                                        <Typography>
                                                            Phone: {item.phone}
                                                        </Typography>
                                                    }
                                                </React.Fragment>
                                            }
                                        />
                                    </ListItem>

                                )) : <></>}
                            </List>
                        </Typography>
                    </Paper>
                </Container>

            </Grid>
            <UpdateDialog field={updateField} state={openDialog} onExit={handleExit} onClose={handleCloseDialog} />
        </Grid >
    )

}