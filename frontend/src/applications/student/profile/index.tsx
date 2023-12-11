import { AccountCircle, CalendarMonth, Email, Phone, Star } from "@mui/icons-material";
import { Button, Container, Grid, Paper, Typography } from "@mui/material";


export default function StudentProfile2() {
    return (
        <Grid container spacing={2} className='bg-[#f3f2f0] min-h-screen'>
            <Grid item xs={3}>
                <Container disableGutters="true" 
                    sx={{width:9/10, bgcolor: "white", display: "flex", flexDirection: "column", gap: 2, borderRadius: 3, my: 3, pb: 3 }}>
                    <Container disableGutters="true"
                        sx={{
                            alignContent: "center",
                            display: 'flex',
                            flexDirection: "column",
                            alignItems: "center",
                        }} >
                        <img
                            src="https://img.freepik.com/premium-photo/happy-young-students-studying-college-library-with-stack-books_21730-4486.jpg"
                            className=" w-full  rounded-t-xl mx-auto  border-2 border-blue-300"
                        />
                        <Button variant="outlined" sx={{ mt: 1 }} size="small">Change photo</Button>
                    </Container>

                    <Typography variant="body2" className='pl-5'> <AccountCircle /> Name: <span className="font-bold"> Tran Tri Dat </span> </Typography>
                    <Typography variant="body2" className='pl-5'><Email /> Email: <span className="font-bold">dat.trantri2002@hcmut.edu.vn </span></Typography>
                    <Typography variant="body2" className='pl-5'><Phone /> Phone: <span className="font-bold">0123456789 </span></Typography>
                    <Typography variant="body2" className='pl-5'><Star /> Major: <span className="font-bold">Computer Engineering </span></Typography>
                    <Typography variant="body2" className='pl-5'><CalendarMonth /> Year: <span className="font-bold">2020 </span></Typography>
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
                        <Paper>
                            Projects                       
                        </Paper>
                        <Paper>
                            Experiences                          
                        </Paper>
                        <Paper>
                            Objectives                        
                        </Paper>
                </Container>
            </Grid>
        </Grid>
    )

}