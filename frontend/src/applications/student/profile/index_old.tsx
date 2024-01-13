import { AccountCircle, CalendarMonth, Check, Code, Create, Email, GitHub, Group, LinkedIn, More, Phone, School, Star, WorkHistory, WorkspacePremium } from "@mui/icons-material";
import { Box, Button, Chip, Container, Grid, IconButton, Link, List, ListItem, ListItemIcon, ListItemText, Paper, Typography } from "@mui/material";
import React from "react";


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

export default function StudentProfile2() {
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
                            src={data.avatar}
                            className=" w-full  rounded-t-xl mx-auto  border-2 border-blue-300"
                        />
                        <Button variant="outlined" sx={{ mt: 1 }} size="small">Change photo</Button>
                        <Chip color="success" icon={<Check />} label="Verified" />

                    </Container>

                    <Typography variant="body2" className='pl-5'> <AccountCircle /> Name: <span className="font-bold">{data.name} </span> </Typography>
                    <Typography variant="body2" className='pl-5'><Email /> Email: <span className="font-bold">{data.email} </span></Typography>
                    <Typography variant="body2" className='pl-5'><Phone /> Phone: <span className="font-bold">{data.phone} </span></Typography>
                    <Typography variant="body2" className='pl-5'><Star /> Major: <span className="font-bold">{data.major} </span></Typography>
                    <Typography variant="body2" className='pl-5'><CalendarMonth /> Year: <span className="font-bold">{data.year} </span></Typography>
                    <Container disableGutters="true"
                        sx={{
                            alignContent: "center",
                            display: 'flex',
                            flexDirection: "column",
                            alignItems: "center",
                        }} >
                        <Button variant="outlined" color="warning" sx={{}} size="small">Request to change information </Button>
                    </Container>



                </Container>

            </Grid>
            <Grid item xs={8.8}>
                <Container disableGutters="true"
                    sx={{ display: "flex", flexDirection: "column", gap: 2, borderRadius: 3, my: 3, pb: 3 }}>
                    <Button href="/student/profile/update" variant="contained" color='primary' sx={{ mt: 1, width:1/6 }} size="small" >Update</Button>
                    <Paper>
                        <Box sx={{ display: 'flex', alignItems: 'left', pl: 2, pt: 2, pb: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                Social Media
                            </Typography>
                            
                        </Box>
                        <Typography variant="body2" sx={{ pl: 2, pb: 2 }}>
                            <List>
                                    <ListItem>
                                        <ListItemIcon><GitHub /></ListItemIcon>
                                        <Link>{data.socialMedia.github}</Link>
                                    </ListItem>
                                    <ListItem>
                                        <ListItemIcon><LinkedIn /></ListItemIcon>
                                        <Link>{data.socialMedia.linkedin}</Link>
                                        
                                    </ListItem>
                            </List>
                        </Typography>
                    </Paper>
                    <Paper>
                        <Box sx={{ display: 'flex', alignItems: 'left', pl: 2, pt: 2, pb: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                Objective
                            </Typography>
                            
                        </Box>
                        <Typography variant="body2" sx={{ pl: 2, pb: 2 }}>
                            {data.objective}
                        </Typography>
                    </Paper>
                    <Paper>
                        <Box sx={{ display: 'flex', alignItems: 'left', pl: 2, pt: 2, pb: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                Education
                            </Typography>
                            
                        </Box>
                        <Typography variant="body2" sx={{ pl: 2, pb: 2 }}>
                            <List>
                                {data.education.map((item) => (
                                    <ListItem>
                                        <ListItemIcon><School /></ListItemIcon>
                                        <ListItemText
                                            primary={item.school}
                                            secondary={
                                                <React.Fragment>
                                                    <Typography variant="body1">
                                                        {item.major}
                                                    </Typography>
                                                    <Typography>
                                                        {item.startTime} - {item.endTime}
                                                    </Typography>
                                                    <Typography>
                                                        GPA: {item.gpa} /10.0
                                                    </Typography>
                                                </React.Fragment>
                                            }
                                        />
                                    </ListItem>

                                ))}
                            </List>
                        </Typography>
                    </Paper>
                    <Paper>
                        <Box sx={{ display: 'flex', alignItems: 'left', pl: 2, pt: 2, pb: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                Working History
                            </Typography>
                            
                        </Box>
                        <Typography variant="body2" sx={{ pl: 2, pb: 2 }}>
                            <List>
                                {data.workingHistory.map((item) => (
                                    <ListItem>
                                        <ListItemIcon><WorkHistory /></ListItemIcon>
                                        <ListItemText
                                            primary={item.company}

                                            secondary={
                                                <React.Fragment>
                                                    <Typography variant="body1">
                                                        {item.time}
                                                    </Typography>
                                                    <Typography>
                                                        {item.position}
                                                    </Typography>
                                                    <Typography>
                                                        GPA: {item.task}
                                                    </Typography>
                                                </React.Fragment>
                                            }
                                        />
                                    </ListItem>

                                ))}
                            </List>
                        </Typography>
                    </Paper>
                    <Paper>
                        <Box sx={{ display: 'flex', alignItems: 'left', pl: 2, pt: 2, pb: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                Certificates
                            </Typography>
                            
                        </Box>
                        <Typography variant="body2" sx={{ pl: 2, pb: 2 }}>
                            <List>
                                {data.certificate.map((item) => (
                                    <ListItem>
                                        <ListItemIcon><WorkspacePremium /></ListItemIcon>
                                        <ListItemText
                                            primary={item.name}
                                            secondary={
                                                <React.Fragment>
                                                    <Typography variant="body1">
                                                        {item.time}
                                                    </Typography>
                                                </React.Fragment>
                                            }
                                        />
                                    </ListItem>

                                ))}
                            </List>
                        </Typography>
                    </Paper>
                    <Paper>
                        <Box sx={{ display: 'flex', alignItems: 'left', pl: 2, pt: 2, pb: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                Skills
                            </Typography>
                            
                        </Box>
                        <Typography variant="body2" sx={{ pl: 2, pb: 2 }}>
                            <List>
                                {data.skill.map((item) => (
                                    <span>{item.name} - </span>
                                ))}
                            </List>
                        </Typography>
                    </Paper>
                    <Paper>
                        <Box sx={{ display: 'flex', alignItems: 'left', pl: 2, pt: 2, pb: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                Additional Information
                            </Typography>
                            
                        </Box>
                        <Typography variant="body2" sx={{ pl: 2, pb: 2 }}>
                            <List>
                                {data.additionalInformation.map((item) => (
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

                                ))}
                            </List>
                        </Typography>
                    </Paper>
                    <Paper>
                        <Box sx={{ display: 'flex', alignItems: 'left', pl: 2, pt: 2, pb: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                References
                            </Typography>
                            
                        </Box>
                        <Typography variant="body2" sx={{ pl: 2, pb: 2 }}>
                            <List>
                                {data.reference.map((item) => (
                                    <ListItem>
                                        <ListItemIcon><Group /></ListItemIcon>
                                        <ListItemText
                                            primary={item.name}
                                            secondary={
                                                <React.Fragment>
                                                    <Typography variant="body1">
                                                        {item.email}
                                                    </Typography>
                                                    <Typography>
                                                        {item.phone}
                                                    </Typography>
                                                </React.Fragment>
                                            }
                                        />
                                    </ListItem>

                                ))}
                            </List>
                        </Typography>
                    </Paper>

                </Container>
            </Grid>
        </Grid>
    )

}