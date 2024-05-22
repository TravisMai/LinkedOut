import React from "react";
import LeftSidebar from "./LeftSidebar.component";
import { Grid } from "@mui/material";
import BrowseCompany from "./BrowseCompany";

const DisplayCompany: React.FC = () => {
  return (
    <Grid
      container
      columnSpacing={2}
      justifyContent="center"
      className="bg-[#f3f2f0] min-h-screen pt-5"
    >
      <Grid item xs={4}>
        <LeftSidebar />
      </Grid>
      <Grid item xs={7}>
        <BrowseCompany />
      </Grid>
    </Grid>
  );
};

export default DisplayCompany;
