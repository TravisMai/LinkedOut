import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import Pending from './Dashboard.pending';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import Chart from './Dashboard.chart';

const cardData = [["Students", "312", "Student"], ["Companies", "53", "Company"], ["Applications", "187", "Job / All jobs"]]



export default function Dashboard(props: any) {
    function handleDisplay(index: string) {
        return () => {
            props.display(index)
        }
    }
    return (
        <Box
            component="main"
            sx={{
                backgroundColor: (theme) =>
                    theme.palette.mode === 'light'
                        ? theme.palette.grey[100]
                        : theme.palette.grey[900],
                flexGrow: 1,
                height: '100vh',
                overflow: 'auto',
            }}
        >
            <Toolbar />
            <Container maxWidth="lg" sx={{ mb: 4 }}>
                <Grid container spacing={3}>
                    {/* Chart */}
                    <Grid item xs={12} md={8} lg={9}>
                        <Paper
                            sx={{
                                p: 2,
                                display: 'flex',
                                flexDirection: 'column',
                                height: 240,
                            }}
                        >
                            <Chart />
                        </Paper>
                    </Grid>
                    {/* Recent Deposits */}
                    <Grid item xs={12} md={4} lg={3}>
                        <Paper
                            sx={{
                                p: 2,
                                display: 'flex',
                                flexDirection: 'column',
                                height: 240,
                                justifyContent: 'space-between'
                            }}
                        >
                            {cardData.map((data) => (
                                <div>
                                    <Link color="primary" href="#" onClick={handleDisplay(data[2])} sx={{ mt: 3 }}>
                                        {data[0]}
                                    </Link>
                                    <p className='font-semibold text-2xl'>{data[1]}</p>
                                </div>

                            ))}
                        </Paper>
                    </Grid>
                    {/* Recent Orders */}
                    <Grid item xs={12}>
                        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                            <Pending display={props.display} />
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    )

}