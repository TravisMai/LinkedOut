import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import { Link, useNavigate } from 'react-router-dom';
import Logo from "@/shared/assets/LinkedOut-Logo.svg";
import { ThemeProvider, createTheme } from '@mui/material';
import { indigo, purple } from '@mui/material/colors';
import FormDialog from './UpdateDialog.component';
import { useMutation, useQuery } from 'react-query';
import axios from 'axios';
import { getJwtToken } from '../../shared/utils/authUtils';

const pages = [['Home', '/company'], ['Jobs', '/company/jobs'], ['Applicants', '/company/applicant'], ['Internships', '/company/internship']];
// const settings = ['Settings', 'Logout'];

const theme = createTheme({
  palette: {
    primary: indigo,
    secondary: purple,
  },
});


const CompanyAppBar = () => {
  const navigate = useNavigate();
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

  // Setting dialog state
  const [open, setOpen] = React.useState(false);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  // const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
  //   setAnchorElUser(event.currentTarget);
  // };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleOpenSettings = () => {
    setOpen(true);
    handleCloseUserMenu();
  }


  const handleLogout = () => {
    handleCloseUserMenu();
    // Logout
    // Mutation to logout
    mutationLogout.mutate();
  }

  const mutationLogout = useMutation<ResponseType, ErrorType>({
    mutationFn: () => axios.post("https://linkedout-hcmut.feedme.io.vn/api/v1/company/logout", {}, {
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
        navigate('/'); // Navigate to the next screen
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


  const handleCloseSettings = () => {
    setOpen(false);
  }

  // Fetch company data
  const [companyData, setcompanyData] = React.useState<companyType | null>();
  const token = getJwtToken();

  // Fetch company data
  useQuery({
    queryKey: "companyData",
    queryFn: () => axios.get("https://linkedout-hcmut.feedme.io.vn/api/v1/company/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
    onSuccess: (data) => {
      console.log(data.data);
      setcompanyData(data.data);
    }
  });

  return (
    <ThemeProvider theme={theme} >
      <AppBar position="static" color="primary">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <img src={Logo} alt='Home Page' className='h-12 hidden md:flex  mr-3' />
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="/company"
              sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                // fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'primary',
                textDecoration: 'none',
              }}
            >
              LinkedOut
            </Typography>

            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: 'block', md: 'none' },
                }}
              >
                {pages.map((page) => (
                  <MenuItem key={page[0]} onClick={handleCloseNavMenu}>
                    <Link to={page[1]}>
                      <Typography textAlign="center">{page[0]}</Typography>
                    </Link>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
            <Typography
              variant="h5"
              noWrap
              component="a"
              href="#app-bar-with-responsive-menu"
              sx={{
                mr: 2,
                display: { xs: 'flex', md: 'none' },
                flexGrow: 1,
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              Linked Out
            </Typography>
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              {pages.map((page) => (
                <Button
                  key={page[0]}
                  onClick={handleCloseNavMenu}
                  sx={{ my: 2, color: 'white', display: 'block' }}
                >
                  <Link to={page[1]}>
                    {page[0]}
                  </Link>
                </Button>
              ))}
            </Box>
            <Typography sx={{ mr: 1 }}>
              {companyData?.name ?? ''}
            </Typography>
            <Box sx={{ flexGrow: 0 }}>
              <Button onClick={(event) => setAnchorElUser(event.currentTarget)} >
                <Avatar alt="Remy Sharp" src={companyData?.avatar ?? ''} />
              </Button>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <MenuItem key="settings" onClick={handleOpenSettings}>
                  <Typography textAlign="center">Settings</Typography>
                </MenuItem>
                <MenuItem key="logout" onClick={handleLogout}>
                  <Typography textAlign="center">Logout</Typography>
                </MenuItem>
              </Menu>
            </Box>

            {/* Dialog */}
            <FormDialog state={open} onClose={handleCloseSettings} />

          </Toolbar>
        </Container>
      </AppBar>
    </ThemeProvider>
  );
}

export default CompanyAppBar