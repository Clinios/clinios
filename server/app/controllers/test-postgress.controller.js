const db = require('../db')
const { errorMessage, successMessage, status } = require("../helpers/status");

const getAllUsers = async (req, res) => {
  const client = await db.getClient()
  try {
    const dbResponse = await db.query(`select * from client limit 100`);

    if (!dbResponse) {
      errorMessage.message = "None found";
      return res.status(status.notfound).send(errorMessage);
    }
    successMessage.data = dbResponse.rows;
    return res.status(status.created).send(successMessage);
  } catch (error) {
    console.log('error:', error)
    errorMessage.message = "Select not successful";
    return res.status(status.error).send(errorMessage);
  } finally {
    client.release()
  }
};

const users = {
  getAllUsers
};

module.exports = users;
