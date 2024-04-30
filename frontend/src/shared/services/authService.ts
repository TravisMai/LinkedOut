import axios from "axios";

export default {
    loginWithGoogle: () => axios.get("https://linkedout-hcmut.feedme.io.vn/api/v1/auth/google-redirect"),
}