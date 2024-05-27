import Typography from "@mui/material/Typography";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import InternshipsList from "./InternshipList.component";

export default function InternshipJobCard({ job }: { job: jobType }) {
  return (
    <div>
      <Accordion
        sx={{
          marginTop: 1,
          marginBottom: 1,
          border: 1,
          borderColor: "#c8d0de",
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMore />}
          aria-controls="panel1-content"
          id="panel1-header"
          sx={{ backgroundColor: "#f3f2f0" }}
        >
          <Typography variant="h5" component="div">
            {job.title}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <InternshipsList jobId={job.id} />
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
