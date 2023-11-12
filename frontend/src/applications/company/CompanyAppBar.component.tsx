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
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { Link } from 'react-router-dom';
import Logo from "@/shared/assets/LinkedOut-Logo.svg";
import { ThemeProvider, createTheme } from '@mui/material';
import { indigo, purple } from '@mui/material/colors';
import FormDialog from './UpdateDialog.component';

const pages = ['Home', 'Jobs', 'Messages', 'Notifications'];
const settings = ['Settings', 'Logout'];

const theme = createTheme({
  palette: {
    primary: indigo,
    secondary: purple,
  },
});


const CompanyAppBar = () => {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

  // Setting dialog state
  const [open, setOpen] = React.useState(false);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

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

  const handleCloseSettings = () => {
    setOpen(false);
  }

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
              href="#app-bar-with-responsive-menu"
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
                  <MenuItem key={page} onClick={handleCloseNavMenu}>
                    <Typography textAlign="center">{page}</Typography>
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
                  key={page}
                  onClick={handleCloseNavMenu}
                  sx={{ my: 2, color: 'white', display: 'block' }}
                >
                  {page}
                </Button>
              ))}
            </Box>

            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt="Remy Sharp" src="data:image/png;base64,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" />
                </IconButton>
              </Tooltip>
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
                <MenuItem key="logout" onClick={handleCloseUserMenu}>
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