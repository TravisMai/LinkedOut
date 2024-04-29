import axios from "axios";

export default {
    loginWithGoogle: () => axios.get("http://52.163.112.173:4000/api/v1/auth/google-redirect"),
}