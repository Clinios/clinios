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
app.use("/api/v1", require("./app/routes/users.routers"));

app.use("/api/v1", require("./app/routes/accounting-search.routes"));
app.use("/api/v1", require("./app/routes/appointment-type-user.routes"));
app.use("/api/v1", require("./app/routes/appointment-type.routes"));
app.use("/api/v1", require("./app/routes/auth-email.routes"));
app.use("/api/v1", require("./app/routes/signup.routes"));
app.use("/api/v1", require("./app/routes/login.routes"));
app.use("/api/v1", require("./app/routes/client-agreement.routes"));
app.use("/api/v1", require("./app/routes/config.routes"));
app.use("/api/v1", require("./app/routes/drug.routes"));
app.use("/api/v1", require("./app/routes/home.routes"));
app.use("/api/v1", require("./app/routes/patient-search.routes"));
app.use("/api/v1", require("./app/routes/patient.routes"));
app.use("/api/v1", require("./app/routes/email-patient.routes"));
app.use("/api/v1", require("./app/routes/password-reset.routes"));
app.use("/api/v1", require("./app/routes/support.routes"));
app.use("/api/v1", require("./app/routes/forms.routes"));
app.use("/api/v1", require("./app/routes/process-lab.routes"));
app.use("/api/v1", require("./app/routes/setup.routes"));
app.use("/api/v1", require("./app/routes/search.routes"));

app.listen(config.port).on("listening", () => {
  console.log(`API is live on ${config.port}`);
});
