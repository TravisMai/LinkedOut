import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import UpdatePhoto from './updatePhoto';

export default function PhotoDialog({ state, onClose }: { state: boolean, onClose: () => void }) {
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
                <UpdatePhoto state={state} onClose={onClose}/>
            </Dialog>
        </React.Fragment>
    );
}