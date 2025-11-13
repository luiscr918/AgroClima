import axios from "axios";
export const apiEjemplo=axios.create({
    baseURL:"http://localhost:8080",
    timeout:5000,
});
