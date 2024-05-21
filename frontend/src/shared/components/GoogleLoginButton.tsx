import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const GoogleLoginButton = (params: { 'role': string }) => {
    const { role } = params;
    const navigate = useNavigate();
    return (
        <GoogleLogin
            useOneTap
            locale="en"
            onSuccess={async (credentialResponse) => {
                console.log('Login Success', credentialResponse.credential);
                const response = await axios.post(
                    'https://linkedout-hcmut.feedme.io.vn/api/v1/auth/google-login',
                    {
                        token: credentialResponse.credential,
                        role: role
                    }
                );
                const data = response.data;
                console.log('data', data);
                document.cookie = `jwtToken=${data.token}; expires=${new Date(Date.now() + 60 * 60 * 1000)}; path=/`;
                navigate("/" + role)
            }}
            onError={() => {
                console.log('Login Failed');
            }}
        />
    );
};

export default GoogleLoginButton;