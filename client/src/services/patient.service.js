import axios from "axios";
import authHeader from "./auth-header";

const API_URL =
  `${process.env.REACT_APP_API_URL}api/v1` || "http://localhost:5000/api/v1";

class Patient {
  getAllergies() {
    return axios
      .get(API_URL + `/patient/allergies`, { headers: authHeader() })
      .then((res) => res.data);
  }
  getAllHandouts() {
    return axios
      .get(API_URL + `/patient/handouts`, { headers: authHeader() })
      .then((res) => res.data);
  }
  getPatientHandouts() {
    return axios
      .get(API_URL + `/patient/patient-handout`, { headers: authHeader() })
      .then((res) => res.data);
  }
  getForms() {
    return axios
      .get(API_URL + `/patient/forms`, { headers: authHeader() })
      .then((res) => res.data);
  }
  getBillings(limit) {
    return axios
      .get(API_URL + `/patient/billing/?limit=${limit}`, {
        headers: authHeader(),
      })
      .then((res) => res.data);
  }
  getDocuments(encounter_id, tab) {
    return axios
      .get(API_URL + `/patient/documents/${encounter_id}/?tab="${tab}"`, {
        headers: authHeader(),
      })
      .then((res) => res.data);
  }
  getPatientData() {
    return axios
      .get(API_URL + `/patient`, { headers: authHeader() })
      .then((res) => res.data);
  }
  getPatientHistory() {
    return axios
      .get(API_URL + `/patient/history`, { headers: authHeader() })
      .then((res) => res.data);
  }
  searchPatient(data) {
    return axios
      .post(API_URL + `/patient/search`, data, { headers: authHeader() })
      .then((res) => res.data);
  }
  getEncounters(encounter_id) {
    return axios
      .get(API_URL + `/patient/encounters/${encounter_id}`, {
        headers: authHeader(),
      })
      .then((res) => res.data);
  }
  getMedicalNotes() {
    return axios
      .get(API_URL + `/patient/medical-notes/history`, {
        headers: authHeader(),
      })
      .then((res) => res.data);
  }
  getAdminNotesHistory() {
    return axios
      .get(API_URL + `/patient/admin-note/history`, {
        headers: authHeader(),
      })
      .then((res) => res.data);
  }
  getMessages() {
    return axios
      .get(API_URL + `/patient/messages`, { headers: authHeader() })
      .then((res) => res.data);
  }
  getDiagnoses(encounter_id) {
    return axios
      .get(API_URL + `/patient/diagnoses/${encounter_id}/?active=true`, {
        headers: authHeader(),
      })
      .then((res) => res.data);
  }
  getMedications(encounter_id) {
    return axios
      .get(API_URL + `/patient/medications/${encounter_id}`, {
        headers: authHeader(),
      })
      .then((res) => res.data);
  }
  getRequisitions(encounter_id) {
    return axios
      .get(API_URL + `/patient/requisitions/${encounter_id}`, {
        headers: authHeader(),
      })
      .then((res) => res.data);
  }
  getTests(encounter_id) {
    return axios
      .get(API_URL + `/patient/all-tests/${encounter_id}`, {
        headers: authHeader(),
      })
      .then((res) => res.data);
  }

  //search methods
  searchAllergies(data) {
    return axios
      .post(API_URL + `/patient/allergies/search`, data, {
        headers: authHeader(),
      })
      .then((res) => res.data);
  }

  searchDiagnosis(data) {
    return axios
      .post(API_URL + `/patient/diagnoses/search`, data, {
        headers: authHeader(),
      })
      .then((res) => res.data);
  }

  //update methods
  updateAdminNotes(data, noteId) {
    return axios.put(API_URL + `/patient/admin-note/${noteId}`, data, {
      headers: authHeader(),
    });
  }

  updateMedicalNotes(data, noteId) {
    return axios.put(
      API_URL + `/patient/medical-notes/history/${noteId}`,
      data,
      {
        headers: authHeader(),
      }
    );
  }

  updateDiagnoses(data, encounter_id, icd_id) {
    return axios.put(
      API_URL + `/patient/diagnoses/${encounter_id}/${icd_id}`,
      data,
      {
        headers: authHeader(),
      }
    );
  }

  //create methods
  createPatientHandout(data) {
    return axios.post(API_URL + `/patient/patient-handout`, data, {
      headers: authHeader(),
    });
  }

  createDocuments(data) {
    return axios.post(API_URL + `/patient/documents/`, data, {
      headers: authHeader(),
    });
  }

  createAllergy(data) {
    return axios.post(API_URL + `/patient/allergies`, data, {
      headers: authHeader(),
    });
  }

  createDiagnoses(data) {
    return axios.post(API_URL + `/patient/diagnoses`, data, {
      headers: authHeader(),
    });
  }

  createMessage(data) {
    return axios.post(API_URL + `/patient/messages`, data, {
      headers: authHeader(),
    });
  }

  //delete methods
  deleteMessages(id) {
    return axios.delete(API_URL + `/patient/messages/${id}`, {
      headers: authHeader(),
    });
  }

  deleteAllergy(patient_id, drug_id) {
    return axios.delete(
      API_URL + `/patient/allergies/${patient_id}/${drug_id}`,
      {
        headers: authHeader(),
      }
    );
  }

  deletePatientHandout(patient_id, handoutId) {
    return axios.delete(
      API_URL + `/patient/patient-handout/${patient_id}/${handoutId}`,
      {
        headers: authHeader(),
      }
    );
  }

  deleteHandout(handoutId) {
    return axios.delete(API_URL + `/patient/handouts/${handoutId}`, {
      headers: authHeader(),
    });
  }

  deleteDocument(patient_id, tab) {
    return axios.delete(
      API_URL + `/patient/documents/${patient_id}/?tab="${tab}"`,
      {
        headers: authHeader(),
      }
    );
  }

  deleteDiagnoses(encounter_id, icd_id) {
    return axios.delete(
      API_URL + `/patient/diagnoses/${encounter_id}/${icd_id}`,
      {
        headers: authHeader(),
      }
    );
  }

  deleteMedications(encounter_id, drug_id, drug_strength_id) {
    return axios.delete(
      API_URL +
        `/patient/medications/${encounter_id}/${drug_id}/${drug_strength_id}`,
      {
        headers: authHeader(),
      }
    );
  }

  deleteRequisitions(encounter_id, cpt_id) {
    return axios.delete(
      API_URL + `/patient/requisitions/${encounter_id}/${cpt_id}`,
      {
        headers: authHeader(),
      }
    );
  }
}

export default new Patient();
