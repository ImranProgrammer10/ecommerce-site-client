import axios from "axios";

const instance = axios.create({
    baseURL: "https://ecommerce-site-v5yu.onrender.com/",
});

export default instance;