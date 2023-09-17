import * as React from 'react';
import Box from '@mui/material/Box';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import People from '@mui/icons-material/People';
import Dns from '@mui/icons-material/Dns';
import { Label } from 'recharts';
import { PropsWithChildren } from 'react';

const data = [
    { icon: <People />, label: 'Authentication' },
    { icon: <Dns />, label: 'Database' },
];

type DataItem = {
    icon: JSX.Element;
    label: string;
};
interface IProps {
    section: string;
    subSection: DataItem[];
}

const ToggleList: React.FC<PropsWithChildren<IProps>> = (props) => {
    const { section, subSection} = props;
    const [open, setOpen] = React.useState(true);
    return (<Box
        sx={{
            pb: open ? 2 : 0,
        }}

    >
        <ListItemButton
            alignItems="flex-start"
            onClick={() => setOpen(!open)}
            sx={{
                px: 3,
                mb: open ? 0 : 1,
                '& svg': { opacity: open ? 1 : 0.5 },
                color: '#707070',
            }}
        >
            <ListItemText
                primary={section}
                primaryTypographyProps={{
                    fontFamily: 'body1',
                    fontWeight: 'medium',
                    lineHeight: '20px',
                    color: 'inherit',
                }}
            />
            <KeyboardArrowDown
                sx={{
                    mr: -1,
                    opacity: 0,
                    transform: open ? 'rotate(90deg)' : 'rotate(0)',
                    transition: '0.2s',
                }}
            />
        </ListItemButton>
        {open &&
            subSection.map((item) => (

                <ListItemButton
                    key={item.label}

                >
                    <ListItemIcon sx={{ color: '#707070' }} className='pl-6'>
                        {item.icon}
                    </ListItemIcon>
                    <ListItemText
                        primary={item.label}
                        primaryTypographyProps={{ fontSize: 14, fontWeight: 'medium' }}
                    />
                </ListItemButton>
            ))}
    </Box>
    );
};

export default ToggleList;