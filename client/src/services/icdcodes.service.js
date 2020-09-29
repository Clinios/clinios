import axios from "axios";
import authHeader from "./auth-header";

const API_URL =
  `${process.env.REACT_APP_API_URL}api/v1` || "http://localhost:5000/api/v1";

class Icdcodes {
  search(data) {
    return axios.post(API_URL + `/icd`, data, { headers: authHeader() });
  }
  addFavorite(id, userId, data) {
    return axios.post(API_URL + `/icd/${id}/${userId}`, data, {
      headers: authHeader(),
    });
  }
  deleteFavorite(id) {
    return axios.delete(API_URL + `/icd/${id}`, {
      headers: authHeader(),
    });
  }
}

export default new Icdcodes();
