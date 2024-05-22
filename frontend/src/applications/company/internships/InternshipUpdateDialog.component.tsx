import * as React from "react";
import Dialog from "@mui/material/Dialog";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import UpdateResult from "./InternshipUpdateResult";
import UploadFile from "./InternshipUploadFile";

export default function InternshipUpdateDialog({
  field,
  state,
  onExit,
  onClose,
  internshipId,
}: {
  field: string;
  state: boolean;
  onExit: () => void;
  onClose: () => void;
  internshipId: string;
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
        {field === "result" && (
          <UpdateResult onClose={onClose} internshipId={internshipId} />
        )}
        {field === "file" && (
          <UploadFile onClose={onClose} internshipId={internshipId} />
        )}
      </Dialog>
    </React.Fragment>
  );
}
