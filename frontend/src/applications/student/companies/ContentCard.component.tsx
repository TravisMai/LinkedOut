import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";
import DefaultAvatar from "@/shared/assets/default-image.jpeg";

export default function ContentCard({ company }: { company: companyType }) {
  return (
    <Card sx={{ minWidth: 275 }}>
      <CardActionArea href={"/student/companies/" + company.id}>
        <CardContent>
          <div className="flex flex-row">
            <div className="mr-4 basis-1/6 items-center">
              <img
                src={
                  company?.avatar
                    ? company?.avatar
                    : DefaultAvatar
                    ?? DefaultAvatar
                }
                className="w-fit mx-auto object-cover rounded-xl max-h-52"
                alt="company avatar"
              />
            </div>
            <div className="basis-5/6 my-auto">
              {/* <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                {company.name}
              </Typography> */}
              <Typography
                variant="h6"
                component="div"
                sx={{ my: 1.5, fontSize: 26 }}
              >
                {company.name}
              </Typography>
              <Typography sx={{ mb: 1.5 }} color="text.secondary">
                Work field: {company.workField}
              </Typography>
              <Typography sx={{ mb: 1.5 }} color="text.secondary">
                Introduction: {company.description}
              </Typography>

              {/* <Typography variant="body2">
                {company.descriptions?.requirements[0]}
                <br />
                {company.descriptions?.responsibilities[0]}
              </Typography> */}
            </div>
          </div>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
