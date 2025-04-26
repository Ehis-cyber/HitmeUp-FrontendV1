import axios from "axios";

export const handleLogin = async (email, password) => {
    try {
        const res = await axios.post("http://localhost:8800/api/auth/login",
             { email, password }, {
            withCredentials: true,
        });
        return res.data; // Return the response data
    } catch (err) {
        throw err; // Re-throw the error for the caller to handle
    }
};