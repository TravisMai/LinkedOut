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
import DefaultAvatar from "@/shared/assets/default-image.jpeg";


export default function InternshipsList({ jobId }: { jobId: string }) {
  const token = getJwtToken();

  // Fetch all applicants of the job
  const [internshipList, setInternshipList] = useState<internshipType[]>([]);

  useQuery({
    queryKey: "jobApplicants" + jobId,
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
      // Filter out internships with jobApplicant status is approved
      setInternshipList(data.data?.filter((internship: internshipType) => internship.jobApplicants.status === "Approved"));
    },
  });

  return (
    <List sx={{ width: "100%", bgcolor: "background.paper" }}>
      {internshipList?.length > 0 ? internshipList?.map((internship) => (
        <div key={internship.id}>
          <ListItemButton
            alignItems="flex-start"
            href={"/company/internship/" + internship.id}
          >
            <ListItemAvatar>
              <Avatar
                src={
                  !internship?.jobApplicants?.student?.avatar?.includes("https://scontent")
                    ? internship?.jobApplicants?.student?.avatar
                    : DefaultAvatar
                    ?? DefaultAvatar
                }
              />
            </ListItemAvatar>
            <ListItemText
              primary={internship?.jobApplicants?.student?.name ?? ""}
              secondary={internship?.jobApplicants?.student?.email ?? ""}
            />
            <ListItemText primary={"Result"} secondary={internship?.result ?? "---"} />
            <ListItemText
              primary={"Uploaded files"}
              secondary={
                internship?.document
                  ?.map((doc) => doc.name)
                  .join(", ") ?? "---"
              }
            />
          </ListItemButton>
          <Divider variant="inset" component="li" />
        </div>
      )) : "No applicant"}
    </List>
  );
}
