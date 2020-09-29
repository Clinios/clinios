import axios from "axios";
import authHeader from "./auth-header";

const API_URL =
    `${process.env.REACT_APP_API_URL}api/v1` || "http://localhost:5000/api/v1";

class ManageUsersService {
    getAll() {
        return axios
            .get(API_URL + `/manage-users`, { headers: authHeader() })
            .then((res) => res.data);
    }
    getForward() {
        return axios
            .get(API_URL + `/manage-users/forward`, { headers: authHeader() })
            .then((res) => res.data);
    }
    create(data) {
        return axios.post(API_URL + `/manage-users`, data, {
            headers: authHeader(),
        });
    }
    update(data, userId) {
        return axios.put(
            API_URL + `/manage-users/${userId}`,
            data,
            {
                headers: authHeader(),
            }
        );
    }
    deleteById(id) {
        return axios.delete(API_URL + `/appointment-types/${id}`, {
            headers: authHeader(),
        });
    }
}

export default new ManageUsersService();
