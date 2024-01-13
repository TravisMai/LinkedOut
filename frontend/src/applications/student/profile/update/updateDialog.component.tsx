import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import StudentProfile from './update';

export default function FormDialog({ state, onClose }: { state: boolean, onClose: () => void }) {
    const handleClose = () => {
        onClose();
    };

    return (
        <React.Fragment>
            <Dialog open={state}>
                <IconButton
                    edge="end"
                    color="inherit"
                    onClick={handleClose}
                    aria-label="close"
                    style={{ position: 'absolute', right: 15, top: 15 }}
                >
                    <CloseIcon />
                </IconButton>
                <StudentProfile/>
            </Dialog>
        </React.Fragment>
    );
}