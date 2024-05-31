import {
  AccountCircle,
  CalendarMonth,
  Check,
  Email,
  Phone,
  Star,
  Fingerprint,
} from "@mui/icons-material";
import { Chip, Container, FormControl, Grid, InputLabel, MenuItem, Select, SelectChangeEvent, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { getJwtToken } from "../../../shared/utils/authUtils";
import { useMutation } from "react-query";
import axios from "axios";
import { LoadingButton } from "@mui/lab";
import DefaultAvatar from "@/shared/assets/default-image.jpeg";

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
      // console.log(error);
    },
    onMutate: () => { },
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
      // console.log(error);
    },
  });

  // Handle update
  const handleUpdate = () => {
    mutationUpdate.mutate();
  };
  const mutationUpdate = useMutation<ResponseType, ErrorType>({
    mutationFn: () =>
      axios.put(
        `https://linkedout-hcmut.feedme.io.vn/api/v1/student/${student.id}`,
        { process: status },
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
      // console.log(error);
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
      // console.log(mutationDelete.error);
    },
    onMutate: () => { },
  });

  // Handle update form
  const [status, setStatus] = useState('');

  useEffect(() => {
    setStatus(student.process);
  }, [student.process]);

  const handleChooseStatus = (event: SelectChangeEvent) => {
    setStatus(event.target.value);
  };

  // console.log("status", status)

  // Handle visible
  const [isVisible, setIsVisible] = useState(false);
  const handleVisible = () => {
    setIsVisible(!isVisible);
  };

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
            src={
              !student?.avatar?.includes("https://scontent")
                ? student?.avatar
                : DefaultAvatar
                ?? DefaultAvatar
            }
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
          {student?.isActive ? (
            <Chip color="primary" icon={<Check />} label="Active" />
          ) : (
            <Chip
              color="error"
              icon={<ExclamationCircleOutlined />}
              label="Deactivated"
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

        <FormControl sx={{ minWidth: 120, mx: 2 }}>
          <InputLabel id="demo-simple-select-helper-label">Status</InputLabel>
          <Select
            labelId="status-select"
            id="status-select"
            value={status}
            label="Status"
            // defaultValue={"Received"}
            onChange={handleChooseStatus}
          >
            <MenuItem value={"Received"}>Received</MenuItem>
            <MenuItem value={"Registered"}>Registered</MenuItem>
            <MenuItem value={"Intern"}>Intern</MenuItem>
          </Select>
        </FormControl>
        <LoadingButton
          variant="contained"
          color="primary"
          sx={{ width: "inherit", marginX: "auto" }}
          onClick={handleUpdate}
        >
          Update
        </LoadingButton>
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
          onClick={handleVisible}
        >
          Delete
        </LoadingButton>
        {isVisible &&
          <LoadingButton
            variant="contained"
            color="error"
            sx={{ width: "1/5", marginX: "auto" }}
            onClick={handleDelete}
          >
            Confirm
          </LoadingButton>
        }
      </Container>
    </Grid>
  );
}
