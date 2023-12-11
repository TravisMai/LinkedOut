import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Link } from '@mui/material';

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




export default function ContentCard({ job }: { job: jobType }) {
  return (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <div className='flex flex-row'>
          <div className='mr-4 basis-1/6 center'>
            <img
                src={"/src/shared/assets/" + job.company.avatar}
              className='w-full h-3/4 mt-3 object-cover rounded-xl'
              alt="company avatar" />
          </div>
          <div className='basis-5/6'>
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
              {job.company.name}
            </Typography>
            <Link href="#">
              <Typography variant="h5" component="div">
                {job.title}
              </Typography>
            </Link>
            <Typography sx={{ mb: 1.5 }} color="text.secondary">
              {job.descriptions.aboutUs}
            </Typography>
            <Typography variant="body2">
              {job.descriptions.requirements[0]}
              <br />
              {job.descriptions.responsibilities[0]}
            </Typography>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}