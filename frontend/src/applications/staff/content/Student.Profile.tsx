import {
  AccountCircle,
  CalendarMonth,
  Check,
  Email,
  Phone,
  Star,
  Fingerprint,
} from "@mui/icons-material";
import { Chip, Container, Grid, Typography } from "@mui/material";
import { useState } from "react";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { getJwtToken } from "../../../shared/utils/authUtils";
import { useMutation } from "react-query";
import axios from "axios";
import { LoadingButton } from "@mui/lab";

export default function StudentProfile({
  student,
  handleClose,
}: {
  student: studentType;
  handleClose: () => void;
}) {
  // Fetch for student info
  const token = getJwtToken();

  // Handle verify
  const [verifyData] = useState({
    isVerify: student.isVerify,
  });
  const handleVerify = () => {
    mutationVerify.mutate();
  };
  const mutationVerify = useMutation<ResponseType, ErrorType>({
    mutationFn: () =>
      axios.put(
        `https://linkedout-hcmut.feedme.io.vn/api/v1/student/${student.id}`,
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
      console.log(error);
    },
    onMutate: () => {},
  });

  // Handle disable
  const [disableData] = useState({
    isActive: student.isActive,
  });
  const handleDisable = () => {
    mutationDisable.mutate();
  };
  const mutationDisable = useMutation<ResponseType, ErrorType>({
    mutationFn: () =>
      axios.put(
        `https://linkedout-hcmut.feedme.io.vn/api/v1/student/${student.id}`,
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
        `https://linkedout-hcmut.feedme.io.vn/api/v1/student/${student.id}`,
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
    <Grid container direction={"column"}>
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
            src={`${student?.avatar}`} // Append a unique query parameter to bypass browser caching
            className=" w-full rounded-xl mx-auto  border-2 border-blue-300"
          />
          {student?.isVerify ? (
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
          <AccountCircle /> Name:{" "}
          <span className="font-bold">{student?.name} </span>{" "}
        </Typography>
        <Typography variant="body1" className="pl-5">
          <Fingerprint /> Student ID:{" "}
          <span className="font-bold">{student?.studentId} </span>
        </Typography>
        <Typography variant="body1" className="pl-5">
          <Email /> Email: <span className="font-bold">{student?.email} </span>
        </Typography>
        <Typography variant="body1" className="pl-5">
          <Phone /> Phone:{" "}
          <span className="font-bold">{student?.phoneNumber} </span>
        </Typography>
        <Typography variant="body1" className="pl-5">
          <Star /> Major: <span className="font-bold">{student?.major} </span>
        </Typography>
        <Typography variant="body1" className="pl-5">
          <CalendarMonth /> Year:{" "}
          <span className="font-bold">{student?.year} </span>
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
        {!student.isVerify && (
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
        {!student.isActive ? (
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
  );
}
