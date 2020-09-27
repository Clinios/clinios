import axios from "axios";
import authHeader from "./auth-header";

const API_URL =
  `${process.env.REACT_APP_API_URL}api/v1` || "http://localhost:5000/api/v1";

class MyLoginsService {
  get(userId) {
    return axios
      .get(API_URL + `/my-logins/${userId}`, {
        headers: authHeader(),
      })
      .then((res) => res.data);
  }
}

export default new MyLoginsService();
