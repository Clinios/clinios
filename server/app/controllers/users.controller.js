"use strict";
const { validationResult } = require("express-validator");
const { configuration, makeDb } = require("../db/db.js");
const { errorMessage, successMessage, status } = require("../helpers/status");

const getAll = async (req, res) => {
  const db = makeDb(configuration, res);
  try {
    const dbResponse = await db.query(
      `select u.id, u.firstname, u.lastname, u.title, u.email, u.comment, u.client_id, u.status, u.appointments, u.type, u.schedule, u.admin
        , u.created, concat(u2.firstname, ' ', u2.lastname) created_user
        , u.updated, concat(u3.firstname, ' ', u3.lastname) updated_user
        from user u
        left join user u2 on u2.id=u.created_user_id
        left join user u3 on u3.id=u.updated_user_id
        where u.client_id=${req.client_id}
        order by u.created
        limit 100`
    );

    if (!dbResponse) {
      errorMessage.error = "None found";
      return res.status(status.notfound).send(errorMessage);
    }
    
    successMessage.data = dbResponse;
    return res.status(status.created).send(successMessage);

    
  } catch (err) {
    errorMessage.error = "Select not successful";
    return res.status(status.error).send(errorMessage);
  } finally {
    await db.close();
  }
};
const getForward = async (req,res) =>{
  const db = makeDb(configuration, res);
  try{
    const dbResponse = await db.query(` 
        select u.id, concat(u.firstname, ' ', u.lastname) name
        from user u 
        where u.client_id=${req.client_id}
        order by name
        limit 100`);

    if (!dbResponse) {
      errorMessage.error = "None found";
      return res.status(status.notfound).send(errorMessage);
    }
    successMessage.data = dbResponse;
    return res.status(status.created).send(successMessage);
  }catch{
    errorMessage.error = "Select not successful";
    return res.status(status.error).send(errorMessage);
  } finally {
    await db.close();
  }
}
const create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    errorMessage.error = errors.array();
    return res.status(status.bad).send(errorMessage);
  }
  const db = makeDb(configuration, res);
  let user = req.body.userReq;
  
  (user.created_user_id = req.user_id);
    (user.client_id = req.client_id);
    (user.created = new Date());
    (user.updated = new Date());

  try {
    let checkUser = await db.query(`
    select count(*) as total from user where admin=True and status='A' and client_id=${req.client_id} `);

    if (checkUser[0] != undefined && checkUser[0].total <= 0) {
      errorMessage.error = "client must have at least one user where Admin=True and status=A";
      return res.status(status.inValid).send(errorMessage);
    }
    
    checkUser = await db.query(`
    select count(*) as total from user where email ='${user.email}' and client_id=${req.client_id} `);

    if (checkUser[0] != undefined && checkUser[0].total > 0) {
      errorMessage.error = "User having same email already exists ";
      return res.status(status.inValid).send(errorMessage);
    }

    checkUser = await db.query(`
    select count(*) as total from user where firstname ='${user.firstname}' and lastname = '${user.lastname}' and client_id=${req.client_id} `);

    if (checkUser[0] != undefined && checkUser[0].total > 0) {
      errorMessage.error = "User having same firstname and lastname already exists ";
      return res.status(status.inValid).send(errorMessage);
    }

    console.log('after query', user)
    const dbResponse = await db.query(
      "insert into user set ?",
      user
    );

    console.log(dbResponse)
    if (!dbResponse.insertId) {
      errorMessage.error = "Creation not successful";
      res.status(status.notfound).send(errorMessage);
    }

    successMessage.data = dbResponse;
    successMessage.message = "Creation successful";
    return res.status(status.created).send(successMessage);
  } catch (err) {
    console.log(err)
    errorMessage.error = "Creation not successful";
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
  let user = req.body.userReq;

  user.updated = new Date();
  user.updated_user_id = req.userId;
  user.created = new Date(Date.parse(req.body.userReq.created))
  try {
    let checkUser = await db.query(`
    select count(*) as total from user where admin=True and status='A' and client_id=${req.client_id} `);

    if (checkUser[0] != undefined && checkUser[0].total <= 0) {
      errorMessage.error = "client must have at least one user where Admin=True and status=A";
      return res.status(status.inValid).send(errorMessage);
    }

    checkUser = await db.query(`
    select count(*) as total from user where email ='${user.email}' and client_id=${req.client_id} `);

    if (checkUser[0] != undefined && checkUser[0].total > 0) {
      errorMessage.error = "User having same email already exists ";
      return res.status(status.inValid).send(errorMessage);
    }

    checkUser = await db.query(`
    select count(*) as total from user where firstname ='${user.firstname}' and lastname = '${user.lastname}' and client_id=${req.client_id} `);

    if (checkUser[0] != undefined && checkUser[0].total > 0) {
      errorMessage.error = "User having same firstname and lastname already exists ";
      return res.status(status.inValid).send(errorMessage);
    }

    const updateResponse = await db.query(
      `update user set ? where id =${req.client_id}`,
      [user]
    );

    if (!updateResponse.affectedRows) {
      errorMessage.error = "Update not successful";
      return res.status(status.notfound).send(errorMessage);
    }
    successMessage.data = updateResponse;
    successMessage.message = "Update successful";
    return res.status(status.success).send(successMessage);
  } catch (error) {
    console.log(error)
    errorMessage.error = "Update not successful";
    return res.status(status.error).send(errorMessage);
  } finally {
    await db.close();
  }
};



const users = {
  getAll,
  getForward,
  create,
  update,
};

module.exports = users;
