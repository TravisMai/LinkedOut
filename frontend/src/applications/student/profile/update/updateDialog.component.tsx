import * as React from "react";
import Dialog from "@mui/material/Dialog";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import UpdatePhoto from "./updatePhoto";
import UpdateSocialMedia from "./updateSocialMedia";
import UpdateObjective from "./updateObjective";
import UpdateEducation from "./updateEducation";
import UpdateWorkingHistory from "./updateWorkingHistory";
import UpdateCertificate from "./updateCertificate";
import UpdateSkill from "./updateSkill";
import UpdateAdditionalInformation from "./updateAdditionalInformation";
import UpdateReference from "./updateReference";
import UpdateResume from "./updateResume";

export default function UpdateDialog({
  field,
  state,
  onExit,
  onClose,
}: {
  field: string;
  state: boolean;
  onExit: () => void;
  onClose: () => void;
}) {
  const handleExit = () => {
    onExit();
  };

  return (
    <React.Fragment>
      <Dialog open={state}>
        <IconButton
          edge="end"
          color="inherit"
          onClick={handleExit}
          aria-label="close"
          style={{ position: "absolute", right: 15, top: 15 }}
        >
          <CloseIcon />
        </IconButton>
        {/* Switch based on field here */}
        {field === "avatar" && <UpdatePhoto onClose={onClose} />}
        {field === "socialMedia" && <UpdateSocialMedia onClose={onClose} />}
        {field === "objective" && <UpdateObjective onClose={onClose} />}
        {field === "education" && <UpdateEducation onClose={onClose} />}
        {field === "workingHistory" && (
          <UpdateWorkingHistory onClose={onClose} />
        )}
        {field === "certificate" && <UpdateCertificate onClose={onClose} />}
        {field === "skill" && <UpdateSkill onClose={onClose} />}
        {field === "additionalInformation" && (
          <UpdateAdditionalInformation onClose={onClose} />
        )}
        {field === "reference" && <UpdateReference onClose={onClose} />}
        {field === "resume" && <UpdateResume onClose={onClose} />}
      </Dialog>
    </React.Fragment>
  );
}
