import { Check } from "@mui/icons-material";
import { Chip, Container, Grid, Typography } from "@mui/material";
import { useState } from "react";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { getJwtToken } from "../../../shared/utils/authUtils";
import { useMutation } from "react-query";
import axios from "axios";
import { LoadingButton } from "@mui/lab";

export default function CompanyProfile({
  company,
  handleClose,
}: {
  company: companyType;
  handleClose: () => void;
}) {
  // Fetch for company info
  const token = getJwtToken();

  // Handle verify
  const [verifyData] = useState({
    isVerify: company.isVerify,
  });
  const handleVerify = () => {
    mutationVerify.mutate();
  };
  const mutationVerify = useMutation<ResponseType, ErrorType>({
    mutationFn: () =>
      axios.put(
        `https://linkedout-hcmut.feedme.io.vn/api/v1/company/${company.id}`,
        { isVerify: !verifyData.isVerify },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      ),
    onSuccess: () => {
      handleClose();
    },
    onError: (error) => {
      // setSending(false);
      // setShowError(true);
      console.log(error);
    },
    onMutate: () => {},
  });

  // Handle disable
  const [disableData] = useState({
    isActive: company.isActive,
  });
  const handleDisable = () => {
    mutationDisable.mutate();
  };
  const mutationDisable = useMutation<ResponseType, ErrorType>({
    mutationFn: () =>
      axios.put(
        `https://linkedout-hcmut.feedme.io.vn/api/v1/company/${company.id}`,
        { isActive: !disableData.isActive },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      ),
    onSuccess: () => {
      handleClose();
    },
    onError: (error) => {
      console.log(error);
    },
  });

  // Handle delete

  const handleDelete = () => {
    mutationDelete.mutate();
  };
  const mutationDelete = useMutation<ResponseType, ErrorType>({
    mutationFn: () => {
      return axios.delete(
        `https://linkedout-hcmut.feedme.io.vn/api/v1/company/${company.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
    },
    onSuccess: () => {
      handleClose();
    },
    onError: () => {
      console.log(mutationDelete.error);
    },
    onMutate: () => {},
  });

  return (
    <Grid container>
      <Grid item xs={8}>
        <Container
          disableGutters={true}
          sx={{
            width: 8 / 10,
            bgcolor: "white",
            display: "flex",
            flexDirection: "column",
            gap: 2,
            borderRadius: 3,
            mb: 2,
            pb: 3,
            mt: 5,
          }}
        >
          <Container
            disableGutters={true}
            sx={{
              alignContent: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 1,
            }}
          >
            <img
              src={`${company?.avatar}`} // Append a unique query parameter to bypass browser caching
              className=" w-full rounded-xl mx-auto  border-2 border-blue-300"
            />
            {company?.isVerify ? (
              <Chip color="success" icon={<Check />} label="Verified" />
            ) : (
              <Chip
                color="warning"
                icon={<ExclamationCircleOutlined />}
                label="Not Verified"
              />
            )}
            {/* <Chip color="success" icon={<Check />} label="Verified" /> */}
          </Container>

          <Typography variant="body1" className="pl-5">
            {" "}
            Name: <span className="font-bold">{company?.name} </span>{" "}
          </Typography>
          <Typography variant="body1" className="pl-5">
            {" "}
            Email: <span className="font-bold">{company?.email} </span>
          </Typography>
          <Typography variant="body1" className="pl-5">
            {" "}
            Phone: <span className="font-bold">{company?.phoneNumber} </span>
          </Typography>
          <Typography variant="body1" className="pl-5">
            {" "}
            Address: <span className="font-bold">{company?.address} </span>
          </Typography>
          <Typography variant="body1" className="pl-5">
            Work Field: <span className="font-bold">{company?.workField} </span>
          </Typography>
          <Typography variant="body1" className="pl-5">
            Description:{" "}
            <span className="font-bold">{company?.description} </span>
          </Typography>
          <Typography variant="body1" className="pl-5">
            Website: <span className="font-bold">{company?.website} </span>
          </Typography>
          <Typography variant="body1" className="pl-5">
            Tax ID: <span className="font-bold">{company?.taxId} </span>
          </Typography>

          <Container
            disableGutters={true}
            sx={{
              alignContent: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          ></Container>
          {!company.isVerify && (
            <LoadingButton
              variant="contained"
              color="success"
              sx={{ width: "inherit", marginX: "auto" }}
              onClick={handleVerify}
            >
              Verify
            </LoadingButton>
          )}
          <LoadingButton
            variant="contained"
            color="primary"
            sx={{ width: "inherit", marginX: "auto" }}
          >
            Update
          </LoadingButton>
          {!company.isActive ? (
            <LoadingButton
              variant="contained"
              color="primary"
              sx={{ width: "inherit", marginX: "auto" }}
              onClick={() => {
                handleDisable();
              }}
            >
              Re-enable account
            </LoadingButton>
          ) : (
            <LoadingButton
              variant="contained"
              color="secondary"
              sx={{ width: "inherit", marginX: "auto" }}
              onClick={() => {
                handleDisable();
              }}
            >
              Disable
            </LoadingButton>
          )}
          <LoadingButton
            variant="contained"
            color="error"
            sx={{ width: "inherit", marginX: "auto" }}
            onClick={handleDelete}
          >
            Delete
          </LoadingButton>
        </Container>
      </Grid>
      <Grid item xs={4}>
        {/* Posted jobs */}
        <Container
          disableGutters={true}
          sx={{
            bgcolor: "white",
            display: "flex",
            flexDirection: "column",
            gap: 2,
            borderRadius: 3,
            mb: 2,
            pb: 3,
            mt: 5,
          }}
        >
          <Typography variant="h6" className="pl-5">
            {" "}
            Posted Jobs
          </Typography>
        </Container>
      </Grid>
    </Grid>
  );
}
