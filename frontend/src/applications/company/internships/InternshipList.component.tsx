import {
  Avatar,
  Divider,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { useState } from "react";
import { getJwtToken } from "../../../shared/utils/authUtils";
import { useQuery } from "react-query";
import axios from "axios";

export default function InternshipsList({ jobId }: { jobId: string }) {
  const token = getJwtToken();

  // Fetch all applicants of the job
  const [internshipList, setInternshipList] = useState<internshipType[]>([]);

  useQuery({
    queryKey: "jobApplicants",
    queryFn: () =>
      axios.get(
        `https://linkedout-hcmut.feedme.io.vn/api/v1/internship/job/${jobId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      ),
    onSuccess: (data) => {
      setInternshipList(data.data);
    },
  });

  return (
    <List sx={{ width: "100%", bgcolor: "background.paper" }}>
      {internshipList?.map((internship) => (
        <div key={internship.id}>
          <ListItemButton
            alignItems="flex-start"
            href={"/company/internship/" + internship.id}
          >
            <ListItemAvatar>
              <Avatar
                alt="Remy Sharp"
                src={internship?.jobApplicants?.student?.avatar ?? ""}
              />
            </ListItemAvatar>
            <ListItemText
              primary={internship?.jobApplicants?.student?.name ?? ""}
              secondary={internship?.jobApplicants?.student?.email ?? ""}
            />
            <ListItemText primary={"Result"} secondary={"---"} />
            <ListItemText
              primary={"Uploaded files"}
              secondary={"CTTT, CV, +3"}
            />
          </ListItemButton>
          <Divider variant="inset" component="li" />
        </div>
      ))}
    </List>
  );
}
