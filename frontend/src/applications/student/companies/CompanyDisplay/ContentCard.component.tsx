import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";

export default function ContentCard({ job }: { job: jobType }) {
  return (
    <Card sx={{ minWidth: 275, mt:2 }}>
      <CardActionArea href={"/student/jobs/" + job.id}>
        <CardContent>
          <div className="flex flex-row">
            <div className="basis-5/6">
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
