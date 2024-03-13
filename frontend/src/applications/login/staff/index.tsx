import CssBaseline from '@mui/material/CssBaseline';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Logo from "@/shared/assets/LinkedOut-Logo.svg";
import GoogleLoginButton from '../../../shared/components/GoogleLoginButton.tsx';
import { Container } from '@mui/material';

const defaultTheme = createTheme();

export default function StaffLogin() {
  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: 'auto' }} className='justify-center items-center my-auto absolute top-0 bottom-0 left-0 right- bg-[url(https://thesaigontimes.vn/wp-content/uploads/2023/02/khoa-hoc-va-ky-thuat-may-tinh-1.jpg)] bg-cover'>
        <CssBaseline />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square className='rounded-xl'>
          <Container
            sx={{
              my: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}

          >
            <img
              src={Logo}
              className='w-1/5 h-1/5 rounded-full mb-4'
            />
            <Typography component="h1" variant="h5">
              Login with staff account
            </Typography>
            <Container sx={{
              my: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
              <GoogleLoginButton role="staff" />
            </Container>
            {/* <Link href="/signup/student" variant="body2">Request for an account</Link> */}
          </Container>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}