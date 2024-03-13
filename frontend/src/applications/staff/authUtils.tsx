import axios from 'axios';

export const getJwtToken = () => {
    return document.cookie.split("; ").find((cookie) => cookie.startsWith("jwtToken="))?.split("=")[1];
};

export const validateJwtToken = async (token: any) => {
    try {
        const response = await axios.get("http://localhost:4000/api/v1/staff/me", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};
