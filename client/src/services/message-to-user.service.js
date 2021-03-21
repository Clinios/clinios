import axios from "axios";

import { API_BASE } from "../utils/API_BASE";
import authHeader from "./auth-header";

class Messages {
  getAllMessages() {
    return axios
      .get(`${API_BASE}/user/messages`, { headers: authHeader() })
      .then((res) => res.data);
  }

  getMessageByID(id) {
    return axios
      .get(`${API_BASE}/user/messages/${id}`, { headers: authHeader() })
      .then((res) => res.data);
  }

  getMessageHistory(id) {
    return axios
      .get(`${API_BASE}/user/messages/history/${id}`, { headers: authHeader() })
      .then((res) => res.data);
  }

  getMessageAssignees() {
    return axios
      .get(`${API_BASE}/user/by-client-id`, { headers: authHeader() })
      .then((res) => res.data);
  }

  createMessage(payload) {
    return axios.post(`${API_BASE}/user/messages`, payload, {
      headers: authHeader(),
    }).then((res) => res.data);
  }

  updateMessage(id, payload) {
    return axios.put(`${API_BASE}/user/messages/${id}`, payload, {
      headers: authHeader(),
    }).then((res) => res.data);
  }

  searchUsers(data) {
    return axios
      .post(`${API_BASE}/user/by-client-id`, data, {
        headers: authHeader(),
      })
      .then((res) => res.data);
  }
}

export default new Messages();
