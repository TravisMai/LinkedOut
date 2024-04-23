import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { CardActionArea, Link } from '@mui/material';

const bull = (
  <Box
    component="span"
    sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
  >
    •
  </Box>
);


export default function ContentCard({ job }: { job: jobType }) {
  return (
    <Card sx={{ minWidth: 275 }}>
      <CardActionArea href={'/student/jobs/' + job.id}>
        <CardContent>
          <div className='flex flex-row'>
            
            <div className='basis-5/6'>
              <Typography variant="h5" component="div">
                {job.title}
              </Typography>
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
      </CardActionArea>
    </Card>
  );
}