import axios from "axios";

export default axios.create({
    baseURL: 'https://localhost:7288',
    withCredentials: true
});