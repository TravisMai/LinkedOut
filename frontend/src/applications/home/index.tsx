import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Logo from "@/shared/assets/LinkedOut-Logo.svg";


const cards = ["Student", "Company"];

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function HomePage() {
    return (
        <ThemeProvider theme={defaultTheme}>
            <CssBaseline />
            <main>
                {/* Hero unit */}
                <Box
                    sx={{
                        bgcolor: 'background.paper',
                        pt: 8,
                        pb: 6,
                    }}
                >
                    <Container maxWidth="sm">
                        <div className='flex flex-row justify-evenly mb-10' >
                            <img
                                src={Logo}
                                className='w-2/5 h-2/5 rounded-full'
                            />
                        </div>
                        <Typography
                            component="h1"
                            variant="h4"
                            align="center"
                            color="text.primary"
                            gutterBottom
                        >
                            LinkedOut
                        </Typography>
                        <Typography variant="h5" align="center" color="text.secondary" paragraph>
                            Website to support students to find internship and job opportunities.
                        </Typography>
                        <Stack
                            sx={{ pt: 4 }}
                            direction="row"
                            spacing={2}
                            justifyContent="center"
                        >
                        </Stack>
                    </Container>
                </Box>
                <Container maxWidth="md">
                    {/* End hero unit */}
                    <Grid container spacing={4} sx={{ justifyContent: 'space-evenly' }}>
                        {cards.map((card) => (
                            <Grid item key={card} xs={12} sm={6} md={4}>
                                <Card
                                    sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                                >
                                    <CardMedia
                                        component="div"
                                        sx={{
                                            // 16:9
                                            pt: '56.25%',
                                        }}
                                        image="https://source.unsplash.com/random?wallpapers"
                                    />
                                    <CardContent sx={{ flexGrow: 1 }}>
                                        <Typography gutterBottom variant="h5" component="h2" align='center'>
                                            {card}
                                        </Typography>
                                        <Typography align='center'>
                                            Click here if you are {card}
                                        </Typography>
                                    </CardContent>
                                    <CardActions sx={{ display: 'flex', justifyContent: 'space-evenly', marginBottom: 0 }}>
                                        <Button size="small">Login</Button>
                                        <Button size="small">Sign up</Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </main>
            {/* Footer */}
            <Box sx={{ bgcolor: 'background.paper', p: 6 }} component="footer">
                <Typography variant="h6" align="center" gutterBottom>
                    LinkOut - Graduation project
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