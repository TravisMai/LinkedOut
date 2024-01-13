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

type jobType = {
  "id": string,
  "company": {
    "id": string,
    "name": string,
    "email": string,
    "avatar": string,
    "workField": string,
    "address": string,
  },
  "title": string,
  "image": null,
  "salary": null,
  "level": string,
  "workType": string,
  "quantity": number,
  "descriptions": {
    "aboutUs": string,
    "responsibilities": [string],
    "requirements": [string],
  }
}

export default function ContentCard({ job }: { job: jobType }){
  return (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          {job.title}
        </Typography>
        <Typography variant="h5" component="div">
          {job.company.name}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          {job.company.workField}
        </Typography>
        <Typography variant="body2">
          {job.descriptions.aboutUs}
          <br />
          {job.descriptions.responsibilities[0]}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Learn More</Button>
      </CardActions>
    </Card>
  );
}