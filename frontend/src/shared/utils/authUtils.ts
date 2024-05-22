import axios from "axios";

// Get JWT token from cookie
export const getJwtToken = (): string | undefined => {
    const tokenString = document.cookie.split("; ").find((cookie) => cookie.startsWith("jwtToken="))?.split("=")[1];
    if (tokenString) {
        return tokenString;
    } else {
        return undefined;
    }
};

export const validateJwtToken = async (token: string, role: string): Promise<boolean> => {
    try {
        await axios.get(`https://linkedout-hcmut.feedme.io.vn/api/v1/${role}/me`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return true;
    } catch (error) {
        return false;
    }
};