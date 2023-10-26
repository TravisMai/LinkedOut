import axios from "axios";

export default {
    loginWithGoogle: () => axios.get("http://localhost:5000/api/v1/auth/google-redirect"),
}