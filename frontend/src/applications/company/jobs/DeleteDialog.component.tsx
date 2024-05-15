import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import { Box, Button, Container, CssBaseline, Grid, IconButton, ThemeProvider, Typography, createTheme } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useMutation } from 'react-query';
import axios from 'axios';
import { getJwtToken } from '../../../shared/utils/authUtils';
import { useNavigate } from 'react-router-dom';

const defaultTheme = createTheme();

export default function DeleteDialog({ jobId, state, onExit }: { jobId: string, state: boolean, onExit: () => void }) {

    const navigate = useNavigate();

    const token = getJwtToken();

    const handleExit = () => {
        onExit();
    }

    const onChoice = () => {
        mutationDelete.mutate()
    }

    // Mutate to delete
    const mutationDelete = useMutation<ResponseType, ErrorType>({
        mutationFn: () => {
            return axios.delete(`https://linkedout-hcmut.feedme.io.vn/api/v1/job/${jobId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
        },
        onSuccess: () => {
            navigate('/company/jobs');
        },
        onError: () => {
            console.log(mutationDelete.error);
        },
        onMutate: () => {
        }
    }
    );

    return (
        <React.Fragment>
            <Dialog open={state} >
                <IconButton
                    edge="end"
                    color="inherit"
                    onClick={handleExit}
                    aria-label="close"
                    style={{ position: 'absolute', right: 15, top: 15 }}
                >
                    <CloseIcon />
                </IconButton>
                <ThemeProvider theme={defaultTheme}>
                    <Container component="main" maxWidth="lg" sx={{ marginBottom: 3 }} >
                        <CssBaseline />
                        <Box
                            sx={{
                                marginTop: 8,
                                marginBottom: 3,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                            }}
                        >
                            <Typography component="h1" variant="h5">
                                Do you want to delete this job?
                            </Typography>
                        </Box>

                        <Grid container columnSpacing={3}>
                            <Grid item xs={6}>
                                <Button onClick={onChoice} variant="contained" color="error">Delete</Button>
                            </Grid>
                            <Grid item xs={6}>
                                <Button onClick={onExit} variant="contained" color="primary">Cancel</Button>
                            </Grid>
                        </Grid>
                    </Container>
                </ThemeProvider>







            </Dialog>
        </React.Fragment>
    );
}