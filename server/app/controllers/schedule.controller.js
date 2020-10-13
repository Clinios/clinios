"use strict";
const { validationResult } = require("express-validator");
const { configuration, makeDb } = require("../db/db.js");
const { errorMessage, successMessage, status } = require("../helpers/status");

const getAllUser = async (req, res) => {
  const db = makeDb(configuration, res);
  try {
    const dbResponse = await db.query(`select u.id, u.firstname, u.lastname
        from user u
        where u.client_id=${req.client_id}
        /*and u.status='A'
        and u.appointments=true*/
        order by u.firstname
        limit 100`);

    if (!dbResponse) {
      errorMessage.error = "None found";
      return res.status(status.notfound).send(errorMessage);
    }
    successMessage.data = dbResponse;
    return res.status(status.created).send(successMessage);
  } catch (error) {
    errorMessage.error = "Select not successful";
    return res.status(status.error).send(errorMessage);
  } finally {
    await db.close();
  }
};
const search = async (req, res) => {
  const db = makeDb(configuration, res);
  const { userId } = req.body;
  let $sql;
  try {
    $sql = `select us.id, us.user_id, concat(u.firstname, ' ', u.lastname) user_name, us.date_start, us.date_end, us.time_start, us.time_end, us.active, us.created, concat(u2.firstname, ' ', u2.lastname) created_name, us.updated, concat(u3.firstname, ' ', u3.lastname) updated_name
        from user_schedule us
		left join user u on u.id=us.created_user_id
		left join user u2 on u2.id=us.created_user_id
        left join user u3 on u3.id=us.updated_user_id
        where us.client_id=${req.client_id} \n`;
    if (userId) {
      $sql = $sql + `and us.user_id=${userId} \n`;
    }
    $sql = $sql + `limit 500`;

    const dbResponse = await db.query($sql);
    if (!dbResponse) {
      errorMessage.error = "None found";
      return res.status(status.notfound).send(errorMessage);
    }
    successMessage.data = dbResponse;
    return res.status(status.created).send(successMessage);
  } catch (error) {
    errorMessage.error = "Select not successful";
    return res.status(status.error).send(errorMessage);
  } finally {
    await db.close();
  }
};
const createNewSchedule = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    errorMessage.error = errors.array();
    return res.status(status.bad).send(errorMessage);
  }
  const db = makeDb(configuration, res);
  let user_schedule = req.body;

  (user_schedule.client_id = req.client_id),
    (user_schedule.user_id = req.body.user_id || req.user_id),
    (user_schedule.date_start = req.body.date_start),
    (user_schedule.date_end = req.body.date_end),
    (user_schedule.time_start = req.body.time_start),
    (user_schedule.time_end = req.body.time_end),
    (user_schedule.active = req.body.active),
    (user_schedule.note = req.body.note),
    (user_schedule.created = new Date()),
    (user_schedule.created_user_id = req.body.user_id || req.user_id);

  try {
    const dbResponse = await db.query(
      "insert into user_schedule set ?",
      user_schedule
    );

    if (!dbResponse.insertId) {
      errorMessage.error = "Creation not successful";
      res.status(status.notfound).send(errorMessage);
    }

    successMessage.data = dbResponse;
    successMessage.message = "Creation successful";
    return res.status(status.created).send(successMessage);
  } catch (err) {
    errorMessage.error = "Creation not not successful";
    return res.status(status.error).send(errorMessage);
  } finally {
    await db.close();
  }
};
const updateSchedule = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    errorMessage.error = errors.array();
    return res.status(status.error).send(errorMessage);
  }

  const db = makeDb(configuration, res);
  let user_schedule = req.body;

  (user_schedule.user_id = req.body.user_id || req.user_id),
    (user_schedule.date_start = req.body.date_start),
    (user_schedule.date_end = req.body.date_end),
    (user_schedule.time_start = req.body.time_start),
    (user_schedule.time_end = req.body.time_end),
    (user_schedule.active = req.body.active),
    (user_schedule.note = req.body.note),
    (user_schedule.updated = new Date());
  user_schedule.updated_user_id = req.body.user_id || req.user_id;

  try {
    const updateResponse = await db.query(
      `update user_schedule set ? where id =${req.params.scheduleId}`,
      [user_schedule]
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

const deleteSchedule = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    errorMessage.error = errors.array();
    return res.status(status.error).send(errorMessage);
  }
  const db = makeDb(configuration, res);
  try {
    const deleteResponse = await db.query(
      `delete from user_schedule where id=${req.params.id}`
    );

    if (!deleteResponse.affectedRows) {
      errorMessage.error = "Deletion not successful";
      return res.status(status.notfound).send(errorMessage);
    }
    successMessage.data = deleteResponse;
    successMessage.message = "Deletion successful";
    return res.status(status.success).send(successMessage);
  } catch (error) {
    errorMessage.error = "Deletion not successful";
    return res.status(status.error).send(errorMessage);
  } finally {
    await db.close();
  }
};

const schedule = {
  getAllUser,
  search,
  createNewSchedule,
  updateSchedule,
  deleteSchedule,
};
module.exports = schedule;
