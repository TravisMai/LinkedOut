import axios from "axios";

// Get JWT token from cookie
export const getJwtToken = (): JwtToken | undefined => {
    const tokenString = document.cookie.split("; ").find((cookie) => cookie.startsWith("jwtToken="))?.split("=")[1];
    if (tokenString) {
        return { token: tokenString };
    } else {
        return undefined;
    }
};

export const validateJwtToken = async (token: JwtToken, role: String): Promise<boolean> => {
    try {
        await axios.get(`http://localhost:4000/api/v1/${role}/me`, {
            headers: {
                Authorization: `Bearer ${token.token}`,
            },
        });
        return true;
    } catch (error) {
        return false;
    }
};