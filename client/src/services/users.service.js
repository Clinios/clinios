import axios from "axios";
import authHeader from "./auth-header";

const API_URL =
    `${process.env.REACT_APP_API_URL}api/v1` || "http://localhost:5000/api/v1";

class UsersService {
    getAll() {
        return axios
            .get(API_URL + `/users`, { headers: authHeader() })
            .then((res) => res.data);
    }
    getForward() {
        return axios
            .get(API_URL + `/users/forward`, { headers: authHeader() })
            .then((res) => res.data);
    }
    create(data) {
        return axios.post(API_URL + `/users`, data, {
            headers: authHeader(),
        });
    }
    update(data, userId) {
        return axios.put(
            API_URL + `/users/${userId}`,
            data,
            {
                headers: authHeader(),
            }
        );
    }
   
}

export default new UsersService();
