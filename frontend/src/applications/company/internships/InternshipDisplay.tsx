import { AccountCircle, AttachFile, CalendarMonth, DoneOutline, Edit, Email, Fingerprint, Phone, Star, WorkOutline } from "@mui/icons-material";
import { Box, Button, Container, Grid, IconButton, Link, List, ListItem, ListItemIcon, ListItemText, Paper, Typography } from "@mui/material";
import React, { useState } from "react";
import CompanyAppBar from "../CompanyAppBar.component";
import { getJwtToken } from "../../../shared/utils/authUtils";
import { useQuery } from "react-query";
import axios from "axios";
import { useParams } from "react-router-dom";
import InternshipUpdateDialog from "./InternshipUpdateDialog.component";


export default function InternshipDisplay() {
    const { internshipId } = useParams();

    const token = getJwtToken();

    // Fetch for internship info

    const [internship, setInternship] = useState<internshipType>();
    // const [status, setStatus] = useState<string>("");


    // Handle dialog
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


    useQuery({
        queryKey: "internshipInfo",
            queryFn: () => axios.get(`https://linkedout-hcmut.feedme.io.vn/api/v1/internship/${internshipId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }),
        onSuccess: (data) => {
            setInternship(data.data);
            // setStatus(data.data.status);
        }
    });




    return (
        <>
            <CompanyAppBar />
            <Grid container spacing={2} className='bg-[#f3f2f0] min-h-screen' sx={{ mt: 1 }}>
                <Grid item xs={3}>
                    <Container disableGutters={true}
                        sx={{ width: 9 / 10, bgcolor: "white", display: "flex", flexDirection: "column", gap: 2, borderRadius: 3, my: 3, pb: 3, ml: 5 }}>
                        <Container disableGutters={true}
                            sx={{
                                alignContent: "center",
                                display: 'flex',
                                flexDirection: "column",
                                alignItems: "center",
                                gap: 1,
                            }} >
                            <img
                                src={`${internship?.jobApplicants?.student.avatar}`} // Append a unique query parameter to bypass browser caching
                                className=" w-full  rounded-t-xl mx-auto  border-2 border-blue-300"
                            />
                            {/* <Button variant="outlined" sx={{ mt: 1 }} size="small" onClick={() => handleOpenDialog("avatar")}>Change photo</Button>
                            {studentData?.isVerify ? <Chip color="success" icon={<Check />} label="Verified" /> : <Chip color="warning" icon={<ExclamationCircleOutlined />} label="Not Verified" />} */}
                            {/* <Chip color="success" icon={<Check />} label="Verified" /> */}

                        </Container>

                        <Typography variant="body2" className='pl-5'> <AccountCircle /> Name: <span className="font-bold">{internship?.jobApplicants?.student.name} </span> </Typography>
                        <Typography variant="body2" className='pl-5'><Fingerprint /> Student ID: <span className="font-bold">{internship?.jobApplicants?.student.studentId} </span></Typography>
                        <Typography variant="body2" className='pl-5'><Email /> Email: <span className="font-bold">{internship?.jobApplicants?.student.email} </span></Typography>
                        <Typography variant="body2" className='pl-5'><Phone /> Phone: <span className="font-bold">{internship?.jobApplicants?.student.phoneNumber} </span></Typography>
                        <Typography variant="body2" className='pl-5'><Star /> Major: <span className="font-bold">{internship?.jobApplicants?.student.major} </span></Typography>
                        <Typography variant="body2" className='pl-5'><CalendarMonth /> Year: <span className="font-bold">{internship?.jobApplicants?.student.year} </span></Typography>
                        <Container disableGutters={true}
                            sx={{
                                alignContent: "center",
                                display: 'flex',
                                flexDirection: "column",
                                alignItems: "center",
                            }} >
                            <Button variant="outlined" color="primary" sx={{}} href={"/company/applicant/" + internship?.jobApplicants.id} size="large">View full profile</Button>
                        </Container>
                    </Container>
                </Grid>
                <Grid item xs={8.8}>
                    <Container disableGutters={true}
                        sx={{ display: "flex", flexDirection: "column", gap: 2, borderRadius: 3, my: 3, pb: 3 }}>
                        {/* <Box display={'flex'} flexDirection={'row'} gap={2}>
                            <LoadingButton variant="contained" color='success' sx={{ mt: 1, width: 1 / 6 }} size="small" loading={loading} onClick={() => handleUpdate("Approved")} disabled={"Approved" === status}>Approve</LoadingButton>
                            <LoadingButton variant="contained" color='primary' sx={{ mt: 1, width: 1 / 6 }} size="small" loading={loading} onClick={() => handleUpdate("Processing")} disabled={"Processing" === status}>Process</LoadingButton>
                            <LoadingButton variant="contained" color='error' sx={{ mt: 1, width: 1 / 6 }} size="small" loading={loading} onClick={() => handleUpdate("Rejected")} disabled={"Rejected" === status}>Reject</LoadingButton>
                        </Box> */}
                        <Paper>
                            <Box sx={{ display: 'flex', alignItems: 'left', pl: 2, pt: 2, pb: 1 }}>
                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                    Applied for
                                </Typography>
                                {/* <IconButton size="small" onClick={() => handleOpenDialog("resume")}><Edit /></IconButton> */}
                            </Box>
                            <Typography variant="body2" sx={{ pl: 2, pb: 2 }}>
                                <List>
                                    {internship?.jobApplicants?.resume.title ?
                                        <ListItem>
                                            <ListItemIcon><WorkOutline /></ListItemIcon>
                                            <Link href={"/company/jobs/" + internship?.jobApplicants?.job.id}>
                                                <ListItemText
                                                    primary={internship?.jobApplicants?.job.title}
                                                />
                                            </Link>
                                        </ListItem>
                                        : <></>
                                    }
                                </List>
                            </Typography>
                        </Paper>

                        <Paper>
                            <Box sx={{ display: 'flex', alignItems: 'left', pl: 2, pt: 2, pb: 1 }}>
                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                    Result
                                </Typography>
                                <IconButton size="small" onClick={() => handleOpenDialog("result")}><Edit /></IconButton>

                            </Box>
                            <Typography variant="body2" sx={{ pl: 2, pb: 2 }}>
                                <List>
                                    {internship?.result ?
                                        <ListItem>
                                            <ListItemIcon><DoneOutline /></ListItemIcon>
                                            <ListItemText
                                                primary={internship?.result}
                                            />
                                        </ListItem>
                                        : <>No result set</>
                                    }
                                </List>
                            </Typography>
                        </Paper>

                        <Paper>
                            <Box sx={{ display: 'flex', alignItems: 'left', pl: 2, pt: 2, pb: 1 }}>
                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                    Uploaded file
                                </Typography>
                                <IconButton size="small" onClick={() => handleOpenDialog("file")}><Edit /></IconButton>
                            </Box>
                            <Typography variant="body2" sx={{ pl: 2, pb: 2 }}>
                                <List>
                                    {internship?.document ?
                                        internship?.document.map((doc) => (
                                            <ListItem>
                                                <ListItemIcon><AttachFile /></ListItemIcon>
                                                <ListItemText
                                                    primary={doc}
                                                />
                                            </ListItem>
                                        ))
                                        : <>No file uploaded</>
                                    }
                                </List>
                            </Typography>
                        </Paper>


                    </Container>

                </Grid>
            </Grid>
            {internship && <InternshipUpdateDialog field={updateField} state={openDialog} onExit={handleExit} onClose={handleCloseDialog} internshipId={internship.id} />}
        </>
    )

}