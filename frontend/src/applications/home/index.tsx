import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Logo from "@/shared/assets/LinkedOut-Logo.svg";
import Typewriter from 'typewriter-effect';

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme(

);

export default function HomePage() {
    return (
        <ThemeProvider theme={defaultTheme} >
            <CssBaseline />
            <main>
                <Box
                    sx={{
                        bgcolor: 'inherit',
                        pt: 4,
                        pb: 4,
                    }}
                >
                    <Container maxWidth="md">
                        <div className='flex flex-row justify-evenly mb-4' >
                            <img
                                src={Logo}
                                className='w-1/5 h-1/5 rounded-full mx-auto'
                            />
                        </div>
                        <Typography
                            component="h1"
                            variant="h4"
                            align="center"
                            color="text.primary"
                            gutterBottom
                            sx={{ pt: 2 }}
                        >
                            LinkedOut
                        </Typography>
                        <Typewriter
                            options={{
                                strings: ['Website for students to find internship and job opportunities'],
                                autoStart: true,
                                pauseFor: 3000,
                                delay: 10,
                                deleteSpeed: 10,
                                loop: true,
                                cursor: '...',
                                wrapperClassName: 'text-2xl text-gray-500 text-center pl-20 ml-4',
                                // cursorClassName: 'text-xs',
                            }}
                        />
                            {/* <Typography variant="h5" align="center" color="text.secondary" paragraph>
                                Website for students to find internship and job opportunities
                            </Typography> */}                        
                    </Container>
                </Box>
                <Container maxWidth="md">
                    <Grid container spacing={4} sx={{ justifyContent: 'space-evenly' }}>
                        <Grid xs={12} sm={6} md={4} item>
                            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                <CardMedia
                                    component="div"
                                    sx={{
                                        // 16:9
                                        pt: '56.25%',
                                    }}
                                    image="https://www.seatssoftware.com/wp-content/uploads/2022/07/Full-class-student-attendance-and-boosted-retention-rates.png"
                                />
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography gutterBottom variant="h5" component="h2" align='center'>
                                        Student
                                    </Typography>
                                    <Typography align='center'>
                                        Start finding your dream job
                                    </Typography>
                                </CardContent>
                                <CardActions sx={{ display: 'flex', justifyContent: 'space-evenly', marginBottom: 0 }}>
                                    <Link href="/login/student">
                                        <Button size="small">Login</Button>
                                    </Link>
                                    <Link href="/signup/student">
                                        <Button size="small">Sign up</Button>
                                    </Link>
                                </CardActions>
                            </Card>
                        </Grid>
                        <Grid xs={12} sm={6} md={4} item>
                            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                <CardMedia
                                    component="div"
                                    sx={{
                                        // 16:9
                                        pt: '56.25%',
                                    }}
                                    image="https://www.insureon.com/-/jssmedia/blog/posts/2021/photo_group-of-employees-working-on-project.png?h=370&iar=0&w=750&rev=3faabd3c0f7c4e11966caaa037fa4fc8"
                                />
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography gutterBottom variant="h5" component="h2" align='center'>
                                        Company
                                    </Typography>
                                    <Typography align='center'>
                                        Start finding good candidates
                                    </Typography>
                                </CardContent>
                                <CardActions sx={{ display: 'flex', justifyContent: 'space-evenly', marginBottom: 0 }}>
                                    <Link href="/login/company">
                                        <Button size="small">Login</Button>
                                    </Link>
                                    <Link href="/signup/company">
                                        <Button size="small">Sign up</Button>
                                    </Link>
                                </CardActions>
                            </Card>
                        </Grid>

                    </Grid>
                </Container>
            </main>
            {/* Footer */}
            <Box sx={{ bgcolor: 'inherit', pt: 6 }} component="footer">
                <Typography variant="h6" align="center" gutterBottom>
                    LinkedOut - Graduation project
                </Typography>
                <Typography
                    variant="subtitle1"
                    align="center"
                    color="text.secondary"
                    component="p"
                >
                    By MaiHuuNghia and TranTriDat
                </Typography>
            </Box>
            {/* End footer */}
        </ThemeProvider>
    );
}