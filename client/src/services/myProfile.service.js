import axios from "axios";
import authHeader from "./auth-header";

const API_URL =
  `${process.env.REACT_APP_API_URL}api/v1` || "http://localhost:5000/api/v1";

class MyProfileService {
  get(userId) {
    return axios
      .get(API_URL + `/my-profile/${userId}`, { headers: authHeader() })
      .then((res) => res.data);
  }
  update(payload, userId) {
    return axios.put(API_URL + `/my-profile/${userId}`, payload, {
      headers: authHeader(),
    });
  }
}

export default new MyProfileService();
