import axios from "axios";
import authHeader from "./auth-header";

const API_URL =
  `${process.env.REACT_APP_API_URL}api/v1` || "http://localhost:5000/api/v1";

class ForwardEmailService {
  get(userId) {
    return axios
      .get(API_URL + `/forward-email/${userId}`, { headers: authHeader() })
      .then((res) => res.data);
  }
}

export default new ForwardEmailService();
