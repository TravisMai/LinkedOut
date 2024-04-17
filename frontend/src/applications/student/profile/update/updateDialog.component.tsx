import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import UpdatePhoto from './updatePhoto';
import UpdateSocialMedia from './updateSocialMedia';

export default function UpdateDialog({ field, state, onClose }: { field: string, state: boolean, onClose: () => void }) {
    const handleClose = () => {
        onClose();
    };

    return (
        <React.Fragment>
            <Dialog open={state} style={{}}>
                <IconButton
                    edge="end"
                    color="inherit"
                    onClick={handleClose}
                    aria-label="close"
                    style={{ position: 'absolute', right: 15, top: 15 }}
                >
                    <CloseIcon />
                </IconButton>
                {/* Switch based on field here */}
                {field === 'avatar' && <UpdatePhoto onClose={onClose} />}
                {field === 'socialMedia' && <UpdateSocialMedia onClose={onClose} />}

            </Dialog>
        </React.Fragment>
    );
}