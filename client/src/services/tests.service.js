import axios from "axios";

import authHeader from "./auth-header";

const API_URL = `${process.env.REACT_APP_API_URL}api/v1` || "http://localhost:5000/api/v1";

class Tests {
  getAllTests() {
    return axios.get(`${API_URL}/tests`, { headers: authHeader() });
  }

  getTestCptName(cptId) {
    return axios.get(`${API_URL}/tests/page-title/${cptId}`, { headers: authHeader() });
  }

  getLabCpt(patientId) {
    return axios.get(`${API_URL}/tests/lab-cpt/${patientId}`, { headers: authHeader() });
  }
}

export default new Tests();
