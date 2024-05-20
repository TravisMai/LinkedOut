import { Avatar, Divider, List, ListItemAvatar, ListItemButton, ListItemText } from '@mui/material';
import { useState } from 'react';
import { getJwtToken } from '../../../shared/utils/authUtils';
import { useQuery } from 'react-query';
import axios from 'axios';



export default function InternshipsList({ jobId }: { jobId: string }) {

    const token = getJwtToken();

    // Fetch all applicants of the job
    const [applicationList, setApplicationList] = useState<jobApplicationType[]>([]);

    useQuery({
        queryKey: "jobApplicants",
        queryFn: () => axios.get(`https://linkedout-hcmut.feedme.io.vn/api/v1/job_applicants/${jobId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }),
        onSuccess: (data) => {
            setApplicationList(data.data);
        }
    });

    return (
        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
            {applicationList.map((application) => (
                <>
                    <ListItemButton alignItems="flex-start" href={'/company/internship/' + application.id}>
                        <ListItemAvatar>
                            <Avatar alt="Remy Sharp" src={application.student.avatar} />
                        </ListItemAvatar>
                        <ListItemText
                            primary={application.student.name}
                            secondary={application.student.email}
                        />
                        <ListItemText
                            primary={"Result"}
                            secondary={"---"}
                        />
                        <ListItemText
                            primary={"Uploaded files"}
                            secondary={"CTTT, CV, +3"}
                        />
                    </ListItemButton>
                    <Divider variant="inset" component="li" />
                </>

            ))}


        </List>
    );
}