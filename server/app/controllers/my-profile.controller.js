"use strict";
const { validationResult } = require("express-validator");
const { configuration, makeDb } = require("../db/db.js");
const { errorMessage, successMessage, status } = require("../helpers/status");
const bcrypt = require("bcryptjs");
const moment = require("moment");

const get = async (req, res) => {
  const db = makeDb(configuration, res);
  try {
    const dbResponse = await db.query(
      `select firstname, lastname, email, title, created, email_forward_user_id, phone
      from user 
      where id=${req.params.userId}
      `
    );

    if (!dbResponse || dbResponse == 0) {
      errorMessage.error = "None found";
      return res.status(status.notfound).send(errorMessage);
    }
    successMessage.data = dbResponse[0];
    return res.status(status.created).send(successMessage);
  } catch (err) {
    errorMessage.error = "Select not successful";
    return res.status(status.error).send(errorMessage);
  } finally {
    await db.close();
  }
};

const update = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    errorMessage.error = errors.array();
    return res.status(status.error).send(errorMessage);
  }

  const db = makeDb(configuration, res);
  let data = req.body.data;

  data.updated = moment().format("YYYY-MM-DD HH:mm:ss");
  data.updated_user_id = req.params.userId;

  // Convert date format
  data.created = moment(data.created).format("YYYY-MM-DD HH:mm:ss");

  // Hash the password
  if (data.password) data.password = bcrypt.hashSync(data.password, 8);

  try {
    const updateResponse = await db.query(
      `update user set ? where id =${req.params.userId}`,
      [data]
    );

    if (!updateResponse.affectedRows) {
      errorMessage.error = "Update not successful";
      return res.status(status.notfound).send(errorMessage);
    }
    successMessage.data = updateResponse;
    successMessage.message = "Update successful";
    return res.status(status.success).send(successMessage);
  } catch (error) {
    errorMessage.error = "Update not successful";
    return res.status(status.error).send(errorMessage);
  } finally {
    await db.close();
  }
};

const myProfile = {
  get,
  update,
};

module.exports = myProfile;
