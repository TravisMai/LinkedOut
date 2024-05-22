import * as React from "react";
import Dialog from "@mui/material/Dialog";
import { Box, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import StudentProfile from "./Student.Profile";

export default function StudentDialog({
  student,
  state,
  onClose,
}: {
  student: studentType;
  state: boolean;
  onClose: () => void;
}) {
  const handleClose = () => {
    onClose();
  };

  return (
    <React.Fragment>
      <div className="w-">
        <Dialog open={state} fullWidth>
          <Box>
            <IconButton
              edge="end"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
              style={{ position: "absolute", right: 30, top: 15 }}
            >
              <CloseIcon />
            </IconButton>
            <StudentProfile student={student} handleClose={handleClose} />
          </Box>
        </Dialog>
      </div>
    </React.Fragment>
  );
}
