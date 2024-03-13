import * as React from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Link from '@mui/material/Link';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MainListItems from './listItems.component';
import ToggleList from './toggleList.component';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import Dashboard from './content/Dashboard';
import Student from './content/Student';
import Company from './content/Company';
import Verify from './content/action.verify';
import Update from './content/Action.update';
import AllJob from './content/Job.all';
import ManageJob from './content/Job.manage';
import InternshipProgram from './content/Internship.program';
import InternshipRecruitment from './content/Internship.recruitment';
import InternshipResult from './content/Internship.result';
import InternshipReport from './content/Internship.report';
import AllDocument from './content/Document.all';
import UploadDocument from './content/Document.upload';
import { useMutation, useQuery } from 'react-query';
import axios from 'axios';
import { useEffect } from 'react';
import { getJwtToken, validateJwtToken } from './authUtils';
import { useNavigate } from 'react-router-dom';
import { Button, Collapse, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import ChecklistIcon from '@mui/icons-material/Checklist';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import WorkIcon from '@mui/icons-material/Work';
import SubjectIcon from '@mui/icons-material/Subject';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import GradingIcon from '@mui/icons-material/Grading';
import DescriptionIcon from '@mui/icons-material/Description';
import UploadIcon from '@mui/icons-material/Upload';

type ResponseType = {
    response: {
        data: {
            message: string;
        }
    }
}

type ErrorType = {
    response: {
        data: {
            message: string;
        }
    }
}


function Copyright(props: any) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" href="https://mui.com/">
                Your Website
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const drawerWidth: number = 240;

interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
}

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        '& .MuiDrawer-paper': {
            position: 'relative',
            whiteSpace: 'nowrap',
            width: drawerWidth,
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
            boxSizing: 'border-box',
            ...(!open && {
                overflowX: 'hidden',
                transition: theme.transitions.create('width', {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.leavingScreen,
                }),
                width: theme.spacing(7),
                [theme.breakpoints.up('sm')]: {
                    width: 0,
                },
            }),
        },
    }),
);

interface TabPanelProps {
    children?: React.ReactNode;
    index: string;
    value: string;
}

function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Typography>{children}</Typography>
            )}
        </div>
    );
}

const defaultTheme = createTheme();



export default function StaffPage() {
    const navigate = useNavigate();

    // Authenticate staff
    const token = getJwtToken();
    useEffect(() => {
        const checkAuthentication = async () => {

            if (!token) {
                // No jwt token found, redirect to login page
                window.location.href = '/login/staff';
            } else {
                try {
                    // Validate jwt token
                    await validateJwtToken(token);
                    // Token is valid, continue with the component rendering
                } catch (error) {
                    // Error occurred while validating token, redirect to login page
                    window.location.href = '/login/staff';
                }
            }
        };

        checkAuthentication();
    }, []);

    const [openSub, setOpenSub] = React.useState(true);

    const handleClick = () => {
        setOpenSub(!openSub);
    };


    const [open, setOpen] = React.useState(true);
    const toggleDrawer = () => {
        setOpen(!open);
    };
    const [value, setValue] = React.useState("Dashboard");

    // Mutation to logout
    const mutation = useMutation<ResponseType, ErrorType>({
        mutationFn: () => axios.post("http://localhost:4000/api/v1/staff/logout", {}, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }),
        onSuccess: () => {
            document.cookie = `jwtToken=; expires=${new Date(Date.now() - 60 * 60 * 1000)}; path=/`;
            // Delete cookie

            console.log("Logout successfully");
            // setSending(false);
            // setShowError(false);
            // setShowSuccess(true);
            setTimeout(() => {
                // setShowSuccess(false); // Hide the success message
                navigate('/login/staff'); // Navigate to the next screen
            }, 1000);
        },
        onError: (error) => {
            // setSending(false);
            // setShowError(true);
            console.log("Logout failed");
            console.log(error);
        },
        onMutate: () => {
            console.log(token);
            // setSending(true);
            // setShowError(false);
        }
    }
    );


    const handleLogout = () => {
        mutation.mutate();
    }


    return (
        <ThemeProvider theme={defaultTheme}>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <AppBar position="absolute" open={open}>
                    <Toolbar
                        sx={{
                            pr: '24px', // keep right padding when drawer closed
                        }}
                    >
                        <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="open drawer"
                            onClick={toggleDrawer}
                            sx={{
                                marginRight: '36px',
                                ...(open && { display: 'none' }),
                            }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography
                            component="h1"
                            variant="h6"
                            color="inherit"
                            noWrap
                            sx={{ flexGrow: 1 }}
                        >
                            {value}
                        </Typography>
                        <IconButton color="inherit">
                            <Badge badgeContent={4} color="secondary">
                                <NotificationsIcon />
                            </Badge>
                        </IconButton>
                    </Toolbar>
                </AppBar>
                <Drawer variant="permanent" open={open}>
                    <Toolbar
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            px: [1],
                        }}
                    >
                        <IconButton onClick={toggleDrawer}>
                            <ChevronLeftIcon />
                        </IconButton>
                    </Toolbar>
                    <Divider />
                    <List component="nav">

                        <MainListItems display={setValue} />

                        <Divider sx={{ marginBottom: 2 }} />

                        <ToggleList display={setValue} section="Action" subSection={[{ icon: <ChecklistIcon />, label: 'Verify' }]} />
                        <ToggleList display={setValue} section="Job" subSection={[{ icon: <WorkIcon />, label: 'All jobs' },]} />
                        <ToggleList display={setValue} section="Internship" subSection={[{ icon: <SubjectIcon />, label: 'Internship Program' }, { icon: <AssignmentTurnedInIcon />, label: 'Recruitment Result' }, { icon: <GradingIcon />, label: 'Internship Result' }, { icon: <DescriptionIcon />, label: 'Report' }]} />
                        <ToggleList display={setValue} section="Documents" subSection={[{ icon: <DashboardIcon />, label: 'All documents' }, { icon: <UploadIcon />, label: 'Upload' },]} />

                    </List>

                    {/* <Copyright sx={{ position: 'absolute', bottom: '0', pt: 4, pb: 4, pl: 2 }} /> */}
                    {/* Logout butotn */}
                    <div className="flex h-full justify-center items-end mb-20 ">
                        <Button variant="outlined" color="error" sx={{ width: '80%' }}
                            onClick={handleLogout}
                        >
                            Logout
                        </Button>
                        <Copyright sx={{ position: 'absolute', bottom: '0', pt: 4, pb: 4, pl: 2 }} />
                    </div>
                </Drawer>
                <Box
                    component="main"
                    sx={{
                        backgroundColor: (theme) =>
                            theme.palette.mode === 'light'
                                ? theme.palette.grey[100]
                                : theme.palette.grey[900],
                        flexGrow: 1,
                        height: 'auto',
                        overflow: 'auto',
                        minHeight: '100vh',
                    }}
                >
                    <Toolbar />
                    <Container>
                        <Grid className='w-full'>
                            <CustomTabPanel value={value} index={"Dashboard"} >
                                <Dashboard display={setValue} />
                            </CustomTabPanel>
                            <CustomTabPanel value={value} index={"Student"}>
                                <Student />
                            </CustomTabPanel>
                            <CustomTabPanel value={value} index={"Company"}>
                                <Company />
                            </CustomTabPanel>
                            <CustomTabPanel value={value} index={"Action / Verify"}>
                                <Verify />
                            </CustomTabPanel>
                            <CustomTabPanel value={value} index={"Action / Update"}>
                                <Update />
                            </CustomTabPanel>
                            <CustomTabPanel value={value} index={"Job / All jobs"}>
                                <AllJob />
                            </CustomTabPanel>
                            <CustomTabPanel value={value} index={"Job / Manage job"}>
                                <ManageJob />
                            </CustomTabPanel>
                            <CustomTabPanel value={value} index={"Internship / Internship Program"}>
                                <InternshipProgram />
                            </CustomTabPanel>
                            <CustomTabPanel value={value} index={"Internship / Recruitment Result"}>
                                <InternshipRecruitment />
                            </CustomTabPanel>
                            <CustomTabPanel value={value} index={"Internship / Internship Result"}>
                                <InternshipResult />
                            </CustomTabPanel>
                            <CustomTabPanel value={value} index={"Internship / Report"}>
                                <InternshipReport />
                            </CustomTabPanel>
                            <CustomTabPanel value={value} index={"Documents / All documents"}>
                                <AllDocument />
                            </CustomTabPanel>
                            <CustomTabPanel value={value} index={"Documents / Upload"}>
                                <UploadDocument />
                            </CustomTabPanel>
                        </Grid>
                    </Container>
                </Box>
            </Box>
        </ThemeProvider>
    );
}