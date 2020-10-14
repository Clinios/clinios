import axios from "axios";
import authHeader from "./auth-header";

const API_URL =
  `${process.env.REACT_APP_API_URL}api/v1` || "http://localhost:5000/api/v1";
class Schedule {
  getAllUsers() {
    return axios.get(API_URL + `/users`, { headers: authHeader() });
  }
  search(data) {
    return axios.post(API_URL + `/schedule/search`, data, {
      headers: authHeader(),
    });
  }
  createNewSchedule(data) {
    return axios.post(API_URL + `/schedule`, data, { headers: authHeader() });
  }
  updateSchedule(userId, scheduleId, data) {
    return axios.put(API_URL + `/schedule/${userId}/${scheduleId}`, data, {
      headers: authHeader(),
    });
  }
  deleteSchedule(id) {
    return axios.delete(API_URL + `/schedule/${id}`, { headers: authHeader() });
  }
}

export default new Schedule();
