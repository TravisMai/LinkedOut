import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const bull = (
  <Box
    component="span"
    sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
  >
    •
  </Box>
);

type studentType = {
  "id": string,
  "name": string,
  "email": string,
  "phoneNumber": string,
  "avatar": string,
  "isGoogle": boolean,
  "isVerify": boolean,
}

export default function StudentCard({ student }: { student: studentType }) {
  return (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>

        <Typography variant="h5" component="div">
          {student.name}
        </Typography>
        <Typography sx={{ mb: 1.5, mt:1.5 }} color="text.secondary">
          {student.phoneNumber}
        </Typography>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          {student.email}
        </Typography>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          {student.phoneNumber}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Contact this student</Button>
      </CardActions>
    </Card>
  );
}