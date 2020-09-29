"use strict";
const { validationResult } = require("express-validator");
const moment = require("moment");
const { configuration, makeDb } = require("../db/db.js");
const { errorMessage, successMessage, status } = require("../helpers/status");
const {
  transporter,
  newAppointmentTemplate,
  cancelAppointmentTemplate,
  updateAppointmentTemplate,
} = require("../helpers/email");

const getAll = async (req, res) => {
  const db = makeDb(configuration, res);

  try {
    const dbResponse = await db.query(
      `select uc.id, uc.user_id, uc.patient_id, uc.start_dt, uc.end_dt, uc.status, uc.title, uc.notes, uc.client_id
        , p.firstname, p.lastname, p.email, concat(u.firstname, ' ', u.lastname) provider_name
        from user_calendar uc
        left join patient p on p.id=uc.patient_id
        left join user u on u.id=uc.user_id
        where uc.client_id=${req.client_id}
            and uc.user_id=${req.user_id}
      `
    );

    if (!dbResponse) {
      errorMessage.error = "None found";
      return res.status(status.notfound).send(errorMessage);
    }
    successMessage.data = dbResponse;
    return res.status(status.created).send(successMessage);
  } catch (err) {
    console.log("err", err);
    errorMessage.error = "Select not successful";
    return res.status(status.error).send(errorMessage);
  } finally {
    await db.close();
  }
};

const getEventsByProvider = async (req, res) => {
  const db = makeDb(configuration, res);
  const { providerId } = req.params;
  try {
    const dbResponse = await db.query(
      `select uc.id, uc.user_id, uc.patient_id, uc.start_dt, uc.end_dt, uc.status, uc.title, uc.notes, uc.client_id
        , p.firstname, p.lastname, p.email, concat(u.firstname, ' ', u.lastname) provider_name
        from user_calendar uc
        left join patient p on p.id=uc.patient_id
        left join user u on u.id=uc.user_id
        where uc.client_id=${req.client_id}
            and uc.user_id=${providerId}
      `
    );

    if (!dbResponse) {
      errorMessage.error = "None found";
      return res.status(status.notfound).send(errorMessage);
    }
    successMessage.data = dbResponse;
    return res.status(status.created).send(successMessage);
  } catch (err) {
    console.log("err", err);
    errorMessage.error = "Select not successful";
    return res.status(status.error).send(errorMessage);
  } finally {
    await db.close();
  }
};

const createAppointment = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    errorMessage.message = errors.array();
    return res.status(status.bad).send(errorMessage);
  }
  const {
    title,
    notes,
    patient,
    start_dt,
    end_dt,
    provider,
    ApptStatus,
  } = req.body.data;

  const db = makeDb(configuration, res);
  try {
    const insertResponse = await db.query(
      `insert into user_calendar (client_id, user_id, patient_id, start_dt, end_dt, status, title, notes, created, created_user_id) values (${
        req.client_id
      }, ${provider.id}, ${patient.id}, '${moment(start_dt).format(
        "YYYY-MM-DD HH:mm:ss"
      )}', '${moment(end_dt).format(
        "YYYY-MM-DD HH:mm:ss"
      )}', '${ApptStatus}', '${title}', '${notes}', now(), ${req.user_id})`
    );
    if (!insertResponse.affectedRows) {
      errorMessage.error = "Insert not successful";
      return res.status(status.notfound).send(errorMessage);
    }
    const emailTemplate = newAppointmentTemplate(
      patient,
      moment(start_dt).format("YYYY-MM-DD HH:mm:ss"),
      provider
    );
    if (process.env.NODE_ENV === "development") {
      let info = await transporter.sendMail(emailTemplate);
      console.info("Email for new appointment has bees sent!", info);
    } else {
      console.log("process.env.SENDGRID_API_KEY", process.env.SENDGRID_API_KEY);
      sgMail.send(emailTemplate).then(
        (info) => {
          console.log(`** Email for new appointment has bees sent! **`, info);
        },
        (error) => {
          console.error(error);
          if (error.response) {
            console.error("error.response.body:", error.response.body);
          }
        }
      );
    }
    successMessage.data = insertResponse;
    successMessage.message = "Insert successful";
    return res.status(status.created).send(successMessage);
  } catch (err) {
    console.log("err", err);
    errorMessage.error = "Insert not successful";
    return res.status(status.error).send(errorMessage);
  } finally {
    await db.close();
  }
};

const cancelAppointment = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    errorMessage.message = errors.array();
    return res.status(status.bad).send(errorMessage);
  }
  const { id } = req.params;
  const { patient, appointmentDate, providerName } = req.body.data;

  const db = makeDb(configuration, res);
  try {
    const updateResponse = await db.query(
      `update user_calendar
        set status='D', decline_dt=now()
        where id=${id}`
    );
    if (!updateResponse.affectedRows) {
      errorMessage.error = "Update not successful";
      return res.status(status.notfound).send(errorMessage);
    }
    const emailTemplate = cancelAppointmentTemplate(
      patient,
      moment(appointmentDate).format("YYYY-MM-DD HH:mm:ss"),
      providerName
    );
    if (process.env.NODE_ENV === "development") {
      let info = await transporter.sendMail(emailTemplate);
      console.info("Email for cancel appointment has bees sent!", info);
    } else {
      console.log("process.env.SENDGRID_API_KEY", process.env.SENDGRID_API_KEY);
      sgMail.send(emailTemplate).then(
        (info) => {
          console.log(
            `** Email for cancel appointment has bees sent! **`,
            info
          );
        },
        (error) => {
          console.error(error);
          if (error.response) {
            console.error("error.response.body:", error.response.body);
          }
        }
      );
    }
    successMessage.data = updateResponse;
    successMessage.message = "Cancel successful";
    return res.status(status.created).send(successMessage);
  } catch (err) {
    console.log("err", err);
    errorMessage.error = "Cancel not successful";
    return res.status(status.error).send(errorMessage);
  } finally {
    await db.close();
  }
};

const updateAppointment = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    errorMessage.message = errors.array();
    return res.status(status.bad).send(errorMessage);
  }
  const { id } = req.params;
  const {
    title,
    notes,
    patient,
    providerName,
    ApptStatus,
    new_start_dt,
    new_end_dt,
    old_start_dt,
    old_end_dt,
  } = req.body.data;

  const db = makeDb(configuration, res);
  try {
    const updateResponse = await db.query(
      `update user_calendar
        set title='${title}', notes='${notes}', status='${ApptStatus}', start_dt='${new_start_dt}', end_dt='${new_end_dt}'
        where id=${id}`
    );
    if (!updateResponse.affectedRows) {
      errorMessage.error = "Update not successful";
      return res.status(status.notfound).send(errorMessage);
    }
    const emailTemplate = updateAppointmentTemplate(
      patient,
      moment(old_start_dt).format("YYYY-MM-DD HH:mm:ss"),
      providerName,
      moment(new_start_dt).format("YYYY-MM-DD HH:mm:ss")
    );
    if (process.env.NODE_ENV === "development") {
      let info = await transporter.sendMail(emailTemplate);
      console.info("Email for update appointment has bees sent!", info);
    } else {
      console.log("process.env.SENDGRID_API_KEY", process.env.SENDGRID_API_KEY);
      sgMail.send(emailTemplate).then(
        (info) => {
          console.log(
            `** Email for update appointment has bees sent! **`,
            info
          );
        },
        (error) => {
          console.error(error);
          if (error.response) {
            console.error("error.response.body:", error.response.body);
          }
        }
      );
    }
    successMessage.data = updateResponse;
    successMessage.message = "Update successful";
    return res.status(status.created).send(successMessage);
  } catch (err) {
    console.log("err", err);
    errorMessage.error = "Update not successful";
    return res.status(status.error).send(errorMessage);
  } finally {
    await db.close();
  }
};

const getAppointmentRequest = async (req, res) => {
  const db = makeDb(configuration, res);
  const { providerId } = req.params;
  try {
    const dbResponse = await db.query(
      `select uc.id, uc.client_id, uc.start_dt, uc.end_dt, concat(p.firstname, ' ', p.lastname) name
        from user_calendar uc
        join patient p on p.id=uc.patient_id
        where uc.client_id=${req.client_id}
        and uc.user_id=${providerId}
        and uc.status='R' /*R=Requested*/
        order by uc.created
        limit 2
      `
    );

    if (!dbResponse) {
      errorMessage.error = "None found";
      return res.status(status.notfound).send(errorMessage);
    }
    successMessage.data = dbResponse;
    return res.status(status.created).send(successMessage);
  } catch (err) {
    console.log("err", err);
    errorMessage.error = "Select not successful";
    return res.status(status.error).send(errorMessage);
  } finally {
    await db.close();
  }
};

const getUnreadMessages = async (req, res) => {
  const db = makeDb(configuration, res);
  const { providerId } = req.params;
  try {
    const dbResponse = await db.query(
      `select m.id, m.created, concat(p.firstname, ' ', p.lastname) name, m.subject, m.message
        from message m
        left join patient p on p.id=m.patient_id_to
        where m.client_id=${req.client_id}
        and m.user_id_from=${providerId}
        and m.read_dt is null
        and m.unread_notify_dt<=current_date()
        order by m.unread_notify_dt
      `
    );

    if (!dbResponse) {
      errorMessage.error = "None found";
      return res.status(status.notfound).send(errorMessage);
    }
    successMessage.data = dbResponse;
    return res.status(status.created).send(successMessage);
  } catch (err) {
    console.log("err", err);
    errorMessage.error = "Select not successful";
    return res.status(status.error).send(errorMessage);
  } finally {
    await db.close();
  }
};

const getProviders = async (req, res) => {
  const db = makeDb(configuration, res);
  try {
    const dbResponse = await db.query(
      `select u.id, concat(u.firstname, ' ', u.lastname) name, d.count, d.dt
        from user u
        left join (
            select d.user_id, sum(d.count) count, min(d.dt) dt from (
            select l.user_id user_id, count(l.id) count, min(l.created) dt
            from lab l
            where l.client_id=${req.client_id}
            and l.status='R' /*R=Requested*/
            group by l.user_id
            union
            select m.user_id_to user_id, count(m.id) count, min(m.created) dt
            from message m
            where client_id=${req.client_id}
            and m.status='O' /*O=Open*/
            group by m.user_id_to
            union
            select m.user_id_from user_id, count(m.id) count, min(m.unread_notify_dt) dt
            from message m
            where m.client_id=${req.client_id}
            and m.read_dt is null
            and m.unread_notify_dt<=current_date()
            group by m.user_id_from
            union
            select uc.user_id user_id, count(uc.client_id) count, min(uc.created) dt
            from user_calendar uc
            where uc.client_id=${req.client_id}
            and uc.status='R' /*R=Requested*/
            group by uc.user_id
            ) d
            where d.user_id is not null
            group by d.user_id
        ) d on d.user_id=u.id
        where u.client_id=${req.client_id}
        and u.status='A'
        order by name
        limit 100
      `
    );

    if (!dbResponse) {
      errorMessage.error = "None found";
      return res.status(status.notfound).send(errorMessage);
    }
    successMessage.data = dbResponse;
    return res.status(status.created).send(successMessage);
  } catch (err) {
    console.log("err", err);
    errorMessage.error = "Select not successful";
    return res.status(status.error).send(errorMessage);
  } finally {
    await db.close();
  }
};

const getProviderDetails = async (req, res) => {
  const db = makeDb(configuration, res);
  try {
    const patientLabs = await db.query(
      `select count(l.id), min(l.created)
            from lab l
            where l.client_id=${req.client_id}
            and l.user_id=1
            and l.status='R' /*R=Requested*/
            /*and (l.pend_dt is null or l.pend_dt<=current_date)*/
      `
    );
    const messageFromPatients = await db.query(
      `select count(m.id), min(m.created)
            from message m
            where m.client_id=${req.client_id}
            and m.user_id_to=1
            and m.status='O' /*O=Open*/
            /*and (m.pend_dt is null or m.pend_dt<=current_date)*/
      `
    );
    const messageToPatientsNotRead = await db.query(
      `select count(m.id), min(m.unread_notify_dt)
        from message m
        where m.client_id=${req.client_id}
        and m.user_id_from=1
        and m.read_dt is null
        and m.unread_notify_dt<=current_date()
      `
    );

    const patientAppointmentRequest = await db.query(
      `select count(m.id), min(m.unread_notify_dt)
        from message m
        where m.client_id=${req.client_id}
        and m.user_id_from=1
        and m.read_dt is null
        and m.unread_notify_dt<=current_date()
      `
    );

    if (!patientLabs) {
      errorMessage.error = "None found";
      return res.status(status.notfound).send(errorMessage);
    }
    successMessage.data = {
      patientLabs: patientLabs[0],
      messageFromPatients: messageFromPatients[0],
      messageToPatientsNotRead: messageToPatientsNotRead[0],
      patientAppointmentRequest: patientAppointmentRequest[0],
    };
    return res.status(status.created).send(successMessage);
  } catch (err) {
    console.log("err", err);
    errorMessage.error = "Select not successful";
    return res.status(status.error).send(errorMessage);
  } finally {
    await db.close();
  }
};

const appointmentTypes = {
  getAll,
  getEventsByProvider,
  createAppointment,
  cancelAppointment,
  updateAppointment,
  getProviders,
  getProviderDetails,
  getAppointmentRequest,
  getUnreadMessages,
};

module.exports = appointmentTypes;
