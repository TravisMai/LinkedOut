import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';

export default function ContentCard({ job }: { job: jobType }) {
  return (
    <Card sx={{ minWidth: 275 }}>
      <CardActionArea href={'/student/jobs/' + job.id}>
        <CardContent>
          <div className='flex flex-row'>
            <div className='mr-4 basis-1/6 center'>
              <img
                src={job.company.avatar}
                className='w-full h-3/4 mt-3 object-cover rounded-xl'
                alt="company avatar" />
            </div>
            <div className='basis-5/6'>
              <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                {job.company.name}
              </Typography>
              <Typography variant="h5" component="div">
                {job.title}
              </Typography>
              <Typography sx={{ mb: 1.5 }} color="text.secondary">
                {job?.descriptions?.aboutUs ?? ""}
              </Typography>
              <Typography variant="body2">
                {job?.descriptions?.requirements?.[0] ?? ""}
                <br />
                {job?.descriptions?.responsibilities?.[0] ?? ""}
              </Typography>
            </div>
          </div>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}