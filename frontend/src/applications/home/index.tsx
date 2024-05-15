import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Logo from "@/shared/assets/LinkedOut-Logo.svg";
import Typewriter from 'typewriter-effect';
import { CardActionArea } from '@mui/material';

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme(

);

export default function HomePage() {
    return (
        <ThemeProvider theme={defaultTheme} >
            <CssBaseline />
            <Box className="flex-col space-y-20 pt-20">
                <Container maxWidth="md">
                    <div className='flex flex-row justify-evenly mb-4' >
                        <img
                            src={Logo}
                            className='w-1/5 h-1/5 rounded-full mx-auto animate-spin'
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
                <Container maxWidth="md">
                    <Grid container spacing={4} sx={{ justifyContent: 'space-evenly' }}>
                        <Grid xs={12} sm={6} md={4} item>
                            <CardActionArea href="/student">
                                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }} >
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
                                </Card>
                            </CardActionArea>
                        </Grid>
                        <Grid xs={12} sm={6} md={4} item>
                            <CardActionArea href="/company">
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
                                </Card>
                            </CardActionArea>
                        </Grid>

                    </Grid>
                </Container>

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
            </Box>
        </ThemeProvider >
    );
}