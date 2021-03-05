export const TransactionFormFields = [
  {
    name: "type",
    id: "transactionTypes",
    label: "Transaction Type",
    baseType: "select",
    type: null,
    options: [],
  },
  {
    name: "amount",
    id: "amount",
    label: "Amount",
    baseType: "input",
    type: "number",
    options: [],
  },
  {
    name: "paymentType",
    id: "paymentType",
    label: "Payment Type",
    baseType: "select",
    type: null,
    options: [
      {
        label: "Card",
        value: "C",
      },
      {
        label: "ACH",
        value: "A",
      },
      {
        label: "Cheque",
        value: "CH",
      },
      {
        label: "Other",
        value: "O",
      },
    ],
  },
  {
    name: "accountNum",
    id: "paymentOptions",
    label: "Card / Bank Account",
    baseType: "select",
    type: "number",
    options: [],
  },
];
