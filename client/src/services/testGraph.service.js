import axios from "axios";

import { API_BASE } from "../utils/API_BASE";
import authHeader from "./auth-header";

class TestGraph {
  getTestGraph() {
    return axios.get(`${API_BASE}/graph/1`, {
      headers: authHeader(),
    });
  }
}

export default new TestGraph();
