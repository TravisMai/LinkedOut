import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const GoogleLoginButton = (params: { 'role': string }) => {
    const { role } = params;
    const navigate = useNavigate();
    return (
        <GoogleLogin
            useOneTap
            onSuccess={async (credentialResponse) => {
                const response = await axios.post(
                    'http://localhost:5000/api/v1/auth/google-login',
                    {
                        token: credentialResponse.credential,
                        role: role
                    }
                );
                const data = response.data;

                localStorage.setItem('authData', JSON.stringify(data));
                navigate("/")
            }}
            onError={() => {
                console.log('Login Failed');
            }}
        />
    );
};

export default GoogleLoginButton;
