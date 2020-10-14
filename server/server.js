const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const config = require("./config.js");
const app = express();

// Add middleware for parsing URL encoded bodies (which are usually sent by browser)
app.use(cors());
// Add middleware for parsing JSON and urlencoded data and populating `req.body`
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.set("trust proxy", true);

app.get("/", (req, res) => {
  const help = `
    <pre>
      Welcome to the API!
      Use an x-access-token header to work with your own data:
      fetch(url, { headers: { 'x-access-token': 'whatever-you-want' }})
      The following endpoints are available:
    </pre>
  `;

  res.send(help);
});

const baseAPIPath = "/api/v1";
app.use(baseAPIPath, require("./app/routes/accounting-search.routes"));
app.use(baseAPIPath, require("./app/routes/appointment-type-user.routes"));
app.use(baseAPIPath, require("./app/routes/appointment-type.routes"));
app.use(baseAPIPath, require("./app/routes/report-finance.routes"));
app.use(baseAPIPath, require("./app/routes/integrations.routes"));
app.use(baseAPIPath, require("./app/routes/auth-email.routes"));
app.use(baseAPIPath, require("./app/routes/signup.routes"));
app.use(baseAPIPath, require("./app/routes/login.routes"));
app.use(baseAPIPath, require("./app/routes/client-agreement.routes"));
app.use(baseAPIPath, require("./app/routes/config.routes"));
app.use(baseAPIPath, require("./app/routes/drug.routes"));
app.use(baseAPIPath, require("./app/routes/home.routes"));
app.use(baseAPIPath, require("./app/routes/patient-search.routes"));
app.use(baseAPIPath, require("./app/routes/patient.routes"));
app.use(baseAPIPath, require("./app/routes/email-patient.routes"));
app.use(baseAPIPath, require("./app/routes/password-reset.routes"));
app.use(baseAPIPath, require("./app/routes/support.routes"));
app.use(baseAPIPath, require("./app/routes/forms.routes"));
app.use(baseAPIPath, require("./app/routes/process-lab.routes"));
app.use(baseAPIPath, require("./app/routes/setup.routes"));
app.use(baseAPIPath, require("./app/routes/search.routes"));
app.use(baseAPIPath, require("./app/routes/icd.routes"));
app.use(baseAPIPath, require("./app/routes/message-to-patient.routes"));
app.use("/api/v1", require("./app/routes/cpt.routes"));
app.use("/api/v1", require("./app/routes/schedule.routes"));

//Patient Portal
app.use(baseAPIPath, require("./app/routes/patient/signup.routes"));
app.use(baseAPIPath, require("./app/routes/patient/login.routes"));
app.use(baseAPIPath, require("./app/routes/patient/home.routes"));

app.use(baseAPIPath, require("./app/routes/myself.routes"));

app.listen(config.port).on("listening", () => {
  console.log(`API is live on ${config.port}`);
});
