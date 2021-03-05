const initialState = {
  patientId: null,
  editorText: null,
  layout: null,
  patientInfo: {
    data: {},
    history: [],
    appointmentHistoryDialog: false,
    editDialog: false,
    historyDialog: false,
  },
  adminNotes: {
    data: [],
    editForm: false,
    historyDialog: false,
  },
  forms: {
    data: [],
    viewDialog: false,
    expandDialog: false,
  },
  handouts: {
    data: [],
    newDialog: false,
    expandDialog: false,
  },
  documents: {
    data: [],
    newDialog: false,
    expandDialog: false,
  },
  encounters: {
    data: [],
    selectedEncounter: null,
    newDialog: false,
    expandDialog: false,
  },
  medicalNotes: {
    data: [],
    editForm: false,
    historyDialog: false,
  },
  allergies: {
    data: [],
    newDialog: false,
    expandDialog: false,
  },
  messages: {
    data: [],
    selectedMessage: null,
    messageType: "New",
    newDialog: false,
    expandDialog: false,
  },
  requisitions: {
    data: [],
    newDialog: false,
    expandDialog: false,
  },
  tests: {
    data: [],
    expandDialog: false,
  },
  diagnoses: {
    data: [],
    activeData: [],
    newDialog: false,
    expandDialog: false,
    status: true,
  },
  medications: {
    data: [],
    newDialog: false,
    expandDialog: false,
  },
  billing: {
    data: [],
    balance: 0,
    newDialog: false,
    expandDialog: false,
    newTransactionDialog: false,
  },
};

export default initialState;
