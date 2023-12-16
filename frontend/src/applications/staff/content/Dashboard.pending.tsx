import * as React from 'react';
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';

// Generate Order Data
function createData(
    id: number,
    date: string,
    companyName: string,
    representative: string,
    phone: number,
    file: string,
) {
    return { id, date, companyName, representative, phone, file };
}

const rows = [
    createData(
        0,
        '16 Mar, 2019',
        'BAN',
        'HQRQ',
        30152512,
        "https://bard.google.com/chat"
    ),
    createData(
        1,
        '16 Mar, 2019',
        'Vonenteq',
        'Tran Tri Dat',
        86635523,
        'https://mui.com'
    ),
    createData(
        2,
        '16 Mar, 2019',
        'Byzocu',
        'Mai Huu Nghia',
        1008513251,
        'File'
    ),
    createData(
        3,
        '16 Mar, 2019',
        'Voltage Computing',
        'Le Chi Hung',
        6545325239,
        'File'
    ),
    createData(
        4,
        '15 Mar, 2019',
        'Shockrip',
        'Dinh Xuan Mai',
        5523532323,
        'File'
    ),
];

function preventDefault(event: React.MouseEvent) {
    event.preventDefault();
}

export default function Pending(props: any) {
    function handleDisplay(index: string) {
        return () => {
            props.display(index)
        }
    }
    return (
        <React.Fragment>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
                Pending verification
            </Typography>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell>Company Name</TableCell>
                        <TableCell>Representative</TableCell>
                        <TableCell>Phone Number</TableCell>
                        <TableCell>File</TableCell>
                        <TableCell align="right">Quick action</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                        <TableRow key={row.id}>
                            <TableCell>{row.date}</TableCell>
                            <TableCell>{row.companyName}</TableCell>
                            <TableCell>{row.representative}</TableCell>
                            <TableCell>{row.phone}</TableCell>
                            <TableCell>
                                <Link color="primary" href={row.file} target="_blank" onClick={handleDisplay("Action / Verify")} sx={{ mt: 3 }}>
                                    File
                                </Link>
                            </TableCell>
                            <TableCell align="right">
                                <Box sx={{ '& > :not(style)': { m: 0.1 } }}>
                                    <IconButton><CheckIcon /></IconButton>
                                    <IconButton><CloseIcon /></IconButton>
                                </Box>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Link color="primary" href="#" onClick={handleDisplay("Action / Verify")} sx={{ mt: 3 }}>
                See all pending verification
            </Link>
        </React.Fragment>
    );
}