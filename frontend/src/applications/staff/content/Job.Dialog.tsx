import * as React from "react";
import Dialog from "@mui/material/Dialog";
import { Box, Button, Container, IconButton, Link, List, ListItem, ListItemIcon, ListItemText, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect, useState } from "react";
import { Check, Search } from "@mui/icons-material";
import { useMutation } from "react-query";
import axios from "axios";
import { getJwtToken } from "../../../shared/utils/authUtils";
import DefaultAvatar from "@/shared/assets/default-image.jpeg";

export default function JobDialog({
    job,
    state,
    onClose,
}: {
    job: jobType;
    state: boolean;
    onClose: () => void;
}) {
    const handleClose = () => {
        onClose();
    };

    const [isInternship, setIsInternship] = useState(false);
    useEffect(() => {
        if (job && job.workType === "Internship") {
            setIsInternship(true);
        }
    }, [job]);

    const handleDelete = () => {
        mutationDelete.mutate();
    };

    const token = getJwtToken();
    // Mutate to delete
    const mutationDelete = useMutation<ResponseType, ErrorType>({
        mutationFn: () => {
            return axios.delete(
                `https://linkedout-hcmut.feedme.io.vn/api/v1/job/${job.id}`,
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
        onMutate: () => { },
    });

    // Handle visible
    const [isVisible, setIsVisible] = useState(false);
    const handleVisible = () => {
        setIsVisible(!isVisible);
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
                    <Container className="my-5">
                        <img
                            src={
                                !job?.company?.avatar?.includes("https://scontent")
                                    ? job?.company?.avatar
                                    : DefaultAvatar
                                    ?? DefaultAvatar
                            }
                            className="w-1/5 object-cover rounded-xl border-2 border-gray-200 mb-2"
                            alt="company avatar"
                        />
                        <Typography variant="h6" sx={{ mb: 1 }}>{job?.company.name}</Typography>

                        <Box display="flex" gap={3}>
                            <Typography variant="h4">{job?.title}</Typography>
                        </Box>

                        <Box
                            display="flex"
                            width={4 / 5}
                            justifyContent="space-evenly"
                            sx={{ my: 3, border: 1, borderRadius: 3 }}
                        >
                            <Box display="flex" flexDirection="column" alignItems="center">
                                <Typography variant="h5">Open Date</Typography>
                                <Typography variant="h6">
                                    {job?.openDate?.toString()?.split("T")?.[0] ?? "---"}
                                </Typography>
                            </Box>
                            <Box display="flex" flexDirection="column" alignItems="center">
                                <Typography variant="h5">Close Date</Typography>
                                <Typography variant="h6">
                                    {job?.expireDate?.toString()?.split("T")?.[0] ?? "---"}
                                </Typography>
                            </Box>
                        </Box>
                        <Typography variant="h6">Description</Typography>
                        <List sx={{ mb: 2 }}>
                            <ListItem>
                                <ListItemText
                                    primary={job?.descriptions?.aboutUs ?? ""}
                                ></ListItemText>
                            </ListItem>
                        </List>
                        <Typography variant="h6">Level</Typography>
                        <List sx={{ mb: 2 }}>
                            <ListItem>
                                <ListItemText primary={job?.workType}></ListItemText>
                            </ListItem>
                        </List>
                        {isInternship && (
                            <>
                                <Typography variant="h6">Internship Program</Typography>
                                <List sx={{ mb: 2 }}>
                                    <ListItem>
                                        <Link href={job?.internshipPrograme}>
                                            {" "}
                                            <ListItemText
                                                primary={job?.company.name + " INTERNSHIP PROGRAM"}
                                            ></ListItemText>
                                        </Link>
                                    </ListItem>
                                </List>

                                <Typography variant="h6">Quantity</Typography>
                                <List sx={{ mb: 2 }}>
                                    <ListItem>
                                        <ListItemText
                                            primary="Required"
                                            secondary={job?.quantity}
                                        ></ListItemText>
                                        <ListItemText
                                            primary="Registered"
                                            secondary={job?.quantity}
                                        ></ListItemText>
                                        <ListItemText
                                            primary="Accepted"
                                            secondary={job?.quantity}
                                        ></ListItemText>
                                        <ListItemText
                                            primary="Max Accept"
                                            secondary={job?.quantity}
                                        ></ListItemText>
                                    </ListItem>
                                </List>
                            </>
                        )}
                        <Typography variant="h6">Responsibilities</Typography>
                        <List sx={{ mb: 2 }}>
                            {job?.descriptions?.responsibilities?.map(
                                (responsibility, index) => (
                                    <ListItem key={index}>
                                        <ListItemIcon>
                                            <Search />
                                        </ListItemIcon>
                                        <ListItemText primary={responsibility}></ListItemText>
                                    </ListItem>
                                ),
                            ) ?? ""}
                        </List>
                        <Typography variant="h6">Requirements</Typography>
                        <List sx={{ mb: 2 }}>
                            {job?.descriptions?.requirements?.map((requirement, index) => (
                                <ListItem key={index}>
                                    <ListItemIcon>
                                        <Check />
                                    </ListItemIcon>
                                    <ListItemText primary={requirement}></ListItemText>
                                </ListItem>
                            )) ?? ""}
                        </List>
                        <Typography variant="h6">Level</Typography>
                        <List sx={{ mb: 2 }}>
                            <ListItem>
                                <ListItemText primary={job?.level}></ListItemText>
                            </ListItem>
                        </List>
                        <Typography variant="h6">Salary</Typography>
                        <List sx={{ mb: 2 }}>
                            <ListItem>
                                <ListItemText
                                    primary={job?.salary ? job.salary : "None"}
                                ></ListItemText>
                            </ListItem>
                        </List>
                        <Button variant="contained" color="error" sx={{ width: "inherit", marginX: "auto" }} onClick={handleVisible}>
                            Delete
                        </Button>
                        {isVisible &&
                            <Button variant="contained" color="error" sx={{ width: "1/5", marginX: "auto", mt: 2 }} onClick={handleDelete}>
                                Confirm
                            </Button>
                        }
                    </Container >
                </Box>
            </Dialog>
        </React.Fragment>
    );
}
