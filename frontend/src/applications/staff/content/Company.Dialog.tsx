import * as React from "react";
import Dialog from "@mui/material/Dialog";
import { Box, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CompanyProfile from "./Company.Profile";

export default function CompanyDialog({
  company,
  state,
  onClose,
}: {
  company: companyType;
  state: boolean;
  onClose: () => void;
}) {
  const handleClose = () => {
    onClose();
  };

  return (
    <React.Fragment>
      <Dialog open={state}>
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
          <CompanyProfile company={company} handleClose={handleClose} />
        </Box>
      </Dialog>
    </React.Fragment>
  );
}
