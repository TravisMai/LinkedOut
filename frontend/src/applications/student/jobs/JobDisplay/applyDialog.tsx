import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import { Box, Container, CssBaseline, Grid, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { LoadingButton } from '@mui/lab';

export default function ApplyDialog({ state, onExit, onClose }: { state: boolean, onExit: () => void, onClose: () => void }) {

    const handleExit = () => {
        onExit();
    }
    const handleClose = () => {
        onClose();
    }

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

                {/* Choose cv to apply */}
                <Container component="main" style={{ width: "" }}>
                    <CssBaseline />
                    <Box
                        sx={{
                            marginTop: 4,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Typography component="h1" variant="h5">
                            Choose CV to apply
                        </Typography>
                        <Box component="form" sx={{ mx: 4, mt: 5, mb: 2 }}>
                            <Grid container spacing={2} justifyContent="center">
                                {/* Display cv list to choose */}
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="h6">CV 1</Typography>
                                    <Typography variant="body1">Name: CV 1</Typography>
                                    <Typography variant="body1">Created at: 2021-10-10</Typography>
                                    <Typography variant="body1">Last updated: 2021-10-10</Typography>
                                </Grid>
                            </Grid>

                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }}>
                                <LoadingButton
                                    // loading={sending}
                                    fullWidth
                                    type="submit"
                                    variant="contained"
                                    // disabled={showSuccess}
                                    sx={{ mt: 2, mb: 2 }}
                                >
                                    Update
                                </LoadingButton>
                            </Box>
                            {/* {showError && <Alert sx={{ mb: 2 }} severity="error">{mutation.error?.response.data.message}</Alert>}
                            {showSuccess && <Alert sx={{ mb: 2 }} severity="success">Update successfully. Back to main page...</Alert>} */}

                        </Box>
                    </Box>
                </Container>





            </Dialog>
        </React.Fragment>
    );
}