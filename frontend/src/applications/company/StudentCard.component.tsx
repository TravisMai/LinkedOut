import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { CardActionArea, Grid } from "@mui/material";

export default function StudentCard({
  application,
}: {
  application: jobApplicationType;
}) {
  return (
    <Card sx={{ minWidth: 275 }}>
      <CardActionArea href={"/company/applicant/" + application.id}>
        <CardContent>
          <Grid container spacing={4}>
            <Grid item xs={2}>
              <img
                src={application.student.avatar}
                className="w-full h-full object-cover rounded-xl"
                alt="company avatar"
              />
            </Grid>
            <Grid item xs={8}>
              <div className="">
                <Typography variant="h5" component="div">
                  {application.student.name}
                </Typography>
                <Typography
                  sx={{ fontSize: 14 }}
                  color="text.secondary"
                  gutterBottom
                >
                  {application.student.email}
                </Typography>
                <Typography
                  sx={{ fontSize: 14 }}
                  color="text.secondary"
                  gutterBottom
                >
                  {application.student.phoneNumber}
                </Typography>
                <Typography sx={{}} color="text.secondary">
                  {application.student.objective}
                </Typography>
                <Typography sx={{}} color="text.secondary">
                  Skills:{" "}
                  {application.student?.skill
                    ?.map((skill) => skill.name)
                    .join(", ") ?? ""}
                </Typography>
              </div>
            </Grid>
            <Grid item xs={2}>
              Applying for
              <Typography variant="h6" component="div">
                {application.job.title}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
