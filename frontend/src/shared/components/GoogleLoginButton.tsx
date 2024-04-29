import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { Database } from 'lucide-react';
import { useNavigate } from "react-router-dom";

const GoogleLoginButton = (params: { 'role': string }) => {
    const { role } = params;
    const navigate = useNavigate();
    return (
        <GoogleLogin
            useOneTap
            locale="en"
            onSuccess={async (credentialResponse) => {
                const response = await axios.post(
                    'http://52.163.112.173:4000/api/v1/auth/google-login',
                    {
                        token: credentialResponse.credential,
                        role: role
                    }
                );
                const data = response.data;

                document.cookie = `jwtToken=${data.token}; expires=${new Date(Date.now() + 60 * 60 * 1000)}; path=/`;
                navigate("/"+role)
            }}
            onError={() => {
                console.log('Login Failed');
            }}
        />
    );
};

export default GoogleLoginButton;
