import * as React from 'react';
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

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
        'NABuoi',
        'HR nhu qq',
        30152512,
        "file"
    ),
    createData(
        1,
        '16 Mar, 2019',
        'Noventiq',
        'Tran Tri Dat',
        86635523,
        'file'
    ),
    createData(
        2,
        '16 Mar, 2019',
        'Cybozu',
        'Mai Huu Nghia',
        1008513251,
        'file'
    ),
    createData(
        3,
        '16 Mar, 2019',
        'Ampere Computing',
        'Le Chi Hung',
        6545325239,
        'file'
    ),
    createData(
        4,
        '15 Mar, 2019',
        'Rockship',
        'Dinh Xuan Mai',
        5523532323,
        'file'
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
                        <TableCell align="right">File</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                        <TableRow key={row.id}>
                            <TableCell>{row.date}</TableCell>
                            <TableCell>{row.companyName}</TableCell>
                            <TableCell>{row.representative}</TableCell>
                            <TableCell>{row.phone}</TableCell>
                            <TableCell align="right">
                                <Link color="primary" href="#" onClick={handleDisplay("Action / Verify")} sx={{ mt: 3 }}>
                                    {row.file}
                                </Link>
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