const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const db = require("../db");
const { errorMessage, successMessage, status } = require("../helpers/status");
const { signupPDF } = require("../helpers/signupPDF");

/**
 * This function validate the records value in database.
 * @param {object} req
 * @param {object} res
 * @returns {object} response
 */
exports.fieldValiate = async (req, res) => {
  if (!req.body.fieldName && !req.body.value) {
    errorMessage.message = "body content must be provided!";
    return res.status(status.error).send(errorMessage);
  }
  let tableName = "client"; // By default let if look into client table
  if (req.body.target) {
    tableName = req.body.target;
  }
  try {
    const selectResponse = await db.query(
      `SELECT id, ${req.body.fieldName} FROM ${tableName} WHERE ${req.body.fieldName} = $1`,
      [req.body.value]
    );
    if (selectResponse.rows.length > 0) {
      errorMessage.message = {
        value: req.body.value,
        msg: `${req.body.value} already taken.`,
        param: `${tableName}.${req.body.fieldName}`,
      };
      return res.status(status.bad).send(errorMessage);
    }
    successMessage.message = {
      value: req.body.value,
      msg: `${req.body.value} can be used.`,
      param: `${tableName}.${req.body.fieldName}`,
    };
    res.status(status.success).send(successMessage);
  } catch (error) {
    return res.status(status.notfound).send(JSON.stringify(error));
  }
};

/**
 * This function let client and user to signup into the system.
 * @param {object} req
 * @param {object} res
 * @returns {object} response
 */
exports.signup = async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    errorMessage.message = errors.array();
    return res.status(status.bad).send(errorMessage);
  }

  const { client } = req.body;
  client.created = new Date();
  client.calendar_start_time = "8:00";
  client.calendar_end_time = "18:00";
  client.functional_range = true;

  const { user } = req.body;
  user.password = bcrypt.hashSync(user.password, 8);

  const existingClientRows = await db.query(
    `SELECT 1 FROM client WHERE name=$1 OR phone=$2  OR fax=$3 OR website=$4 OR email=$5 OR ein=$6 OR npi=$7 OR code=$8 LIMIT 1`,
    [client.name, client.phone, client.fax, client.website, client.email, client.ein, client.npi, client.code]
  );

  if (existingClientRows.length > 0) {
    errorMessage.message = [
      {
        value: JSON.stringify(client),
        msg: "Client is already in our system. Try with different values",
        param: "client.body",
      },
    ];
    return res.status(status.error).send(errorMessage);
  }

  const existingUserRows = await db.query(
    `SELECT 1 FROM users WHERE email=$1 OR npi=$2 OR medical_license=$3 LIMIT 1`,
    [user.email, user.npi, user.medical_license]
  );

  if (existingUserRows.length > 0) {
    errorMessage.message =
      "User is already in our system. Try different values";
    return res.status(status.error).send(errorMessage);
  }
  try {
    const clientResponse = await db.query(`INSERT INTO client(name, code, phone, website) VALUES ('${client.name}', '${client.code}', '${client.phone}', '${client.website}') 
    RETURNING id`);

    console.log('clientResponse:', clientResponse)
    if (!clientResponse.rowCount) {
      errorMessage.message = "Client Cannot be registered";
      res.status(status.notfound).send(errorMessage);
    }

    if (clientResponse.rowCount) {
      user.client_id = clientResponse.rows[0].id; // add user foreign key client_id from clientResponse
      user.admin = 1;
      user.sign_dt = new Date();
      const forwarded = req.headers["x-forwarded-for"];
      const userIP = forwarded
        ? forwarded.split(/, /)[0]
        : req.connection.remoteAddress;
      // TODO: for localhost ::1 might be taken. Need further test
      user.sign_ip_address = userIP;
      const userResponse = await db.query(`INSERT INTO users(firstname, lastname, email, password) VALUES ('${user.firstname}', '${user.lastname}', '${user.email}', '${user.password}') RETURNING id`);
      const clientRows = await db.query(
        "SELECT id, name, email FROM client WHERE id = $1", [clientResponse.rows[0].id]
      );
      const userRows = await db.query(
        "SELECT id, client_id, firstname, lastname, email, sign_ip_address, sign_dt FROM users WHERE id = $1", [userResponse.rows[0].id]
      );
      successMessage.message = "User succesfullly registered!";
      const responseData = {
        user: userRows.rows[0],
        client: clientRows.rows[0],
      };
      // Create contract PDF
      const contractRows = await db.query(
        "SELECT id, contract, created FROM contract WHERE created=(select max(created) from contract)"
      );
      const contractContent = contractRows.rows[0];

      if (process.env.NODE_ENV !== "production") {
        const pdf = await signupPDF(
          contractContent.contract,
          userRows.rows[0],
          clientRows.rows[0]
        );
        if (pdf) {
          await db.query(
            `insert into user_contract (client_id, user_id, contract_id, filename, created) 
              values (${clientResponse.rows[0].id}, ${userResponse.rows[0].id}, ${contractContent.id}, '${pdf.fileName}', now())`
          );
        }
        responseData.contractLink = pdf;
        // end Create contract PDF
      }
      successMessage.data = clientResponse.rows[0].id;
      successMessage.data = responseData;

      // run database procedure to set up basic data for the new Client
      // clientSetup(responseData.user.client_id, responseData.user.id);
      /*try {
        const clientSetupRows = await db.query("CALL clientSetup($1, $2)", [
          responseData.user.client_id,
          responseData.user.id,
        ]);
        console.log("clientSetupRows", clientSetupRows);
      } catch (error) {
        console.log("error", error);
      } */

      res.status(status.created).send(successMessage);
    }  
  } catch (err) {
    // handle the error
    console.log('err:', err)
    errorMessage.message = err.message;
    res.status(status.error).send(errorMessage);
  }
};
