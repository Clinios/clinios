import axios from "axios";
import authHeader from "./auth-header";

const API_URL =
  `${process.env.REACT_APP_API_URL}api/v1` || "http://localhost:5000/api/v1";

class Configuration {
  getConfig(data) {
    return axios.get(API_URL + `/config`, {
      headers: authHeader(),
    });
  }
  getConfigHistory(data) {
    return axios.get(API_URL + `/config/history`, {
      headers: authHeader(),
    });
  }
  updateConfig(id, data) {
    return axios.put(`${API_URL}/config/${id}`, data, {
      headers: authHeader(),
    });
  }
}

export default new Configuration();
