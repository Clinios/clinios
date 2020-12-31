const multer = require("multer");
const fs = require("fs");
const { configuration, makeDb } = require("../db/db.js");
const { errorMessage, successMessage, status } = require("../helpers/status");

const getAll = async (req, res) => {
  const db = makeDb(configuration, res);

  try {
    const dbResponse = await db.query(
      `select h.id, h.filename, h.created, concat(u.firstname, ' ', u.lastname) name, h.client_id
      from handout h
      left join user u on u.id=h.created_user_id
      where h.client_id=${req.client_id}
      order by h.filename
      limit 100`
    );

    if (!dbResponse) {
      errorMessage.message = "None found";
      return res.status(status.notfound).send(errorMessage);
    }
    successMessage.data = dbResponse;
    return res.status(status.created).send(successMessage);
  } catch (err) {
    console.log("err", err);
    errorMessage.message = "Select not successful";
    return res.status(status.error).send(errorMessage);
  } finally {
    await db.close();
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dest = process.env.UPLOAD_DIR;
    // eslint-disable-next-line prefer-arrow-callback
    fs.access(dest, function (error) {
      if (error) {
        console.log("Directory does not exist.");
        return fs.mkdir(dest, (err) => cb(err, dest));
      }
      console.log("Directory exists.");
      return cb(null, dest);
    });
  },
  filename: (req, file, cb) => {
    const fileName = `c${req.client_id}_${file.originalname
      .split(" ")
      .join("-")}`;
    cb(null, fileName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5000000 },
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === "application/pdf" ||
      file.mimetype === "application/msword" ||
      file.mimetype === "text/*" ||
      file.mimetype === "image/png"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Allowed only image, .pdf and text"));
    }
  },
});

const handoutUpload = upload.single("file");

const removeFile = (file) => {
  fs.unlink(file.path, (err) => {
    if (err) {
      console.error(err);
    }
    console.log(file.path, "removed successfully!");
  });
};

const addHandouts = async (req, res) => {
  handoutUpload(req, res, async (err) => {
    if (err) {
      console.log("handoutUpload Error:", err.message);
      errorMessage.message = err.message;
      return res.status(status.error).send(errorMessage);
    }
    if (!req.file) {
      errorMessage.error = "File content can not be empty!";
      return res.status(status.error).send(errorMessage);
    }

    const { notes } = req.body;
    const uploadedFilename = req.file.originalname;
    const db = makeDb(configuration, res);
    try {
      const existingHandout = await db.query(
        `select 1
        from handout
        where client_id=${req.client_id}
        and filename='${uploadedFilename}'
        limit 1`
      );
      if (existingHandout.length > 0) {
        removeFile(req.file);
        errorMessage.error = "Same file is already in our database system!";
        return res.status(status.error).send(errorMessage);
      }

      const insertResponse = await db.query(
        `insert into handout (client_id, filename, notes, created, created_user_id) values (${req.client_id}, '${uploadedFilename}', '${notes}', now(), ${req.user_id})`
      );

      if (!insertResponse.affectedRows) {
        removeFile(req.file);
        errorMessage.error = "Insert not successful";
        return res.status(status.notfound).send(errorMessage);
      }

      // It's limitation of Multer to pass variable to use as filename.
      // Got this idea from https://stackoverflow.com/a/52794573/1960558
      fs.renameSync(
        req.file.path,
        req.file.path.replace("undefined", req.client_id)
      );

      successMessage.data = insertResponse;
      successMessage.message = "Insert successful";
      return res.status(status.created).send(successMessage);
    } catch (excepErr) {
      console.log("excepErr", excepErr);
      errorMessage.error = "Insert not successful";
      return res.status(status.error).send(errorMessage);
    } finally {
      await db.close();
    }
  });
};

const deleteHandout = async (req, res) => {
  const { id } = req.params;

  const db = makeDb(configuration, res);
  try {
    // Call DB query without assigning into a variable
    const deletePatientHandoutResponse = await db.query(`delete
    from patient_handout
    where handout_id=${id}
    `);

    const deleteHandoutResponse = await db.query(`delete
    from handout
    where id=${id}
    `);

    if (!deletePatientHandoutResponse.affectedRows) {
      errorMessage.message = "Patient Handout deletion not successful";
      return res.status(status.notfound).send(errorMessage);
    }
    if (!deleteHandoutResponse.affectedRows) {
      errorMessage.message = "Handout deletion not successful";
      return res.status(status.notfound).send(errorMessage);
    }

    successMessage.data = deleteHandoutResponse;
    successMessage.message = "Delete successful";
    return res.status(status.created).send(successMessage);
  } catch (err) {
    console.log(err);
    errorMessage.message = "Delete not successful";
    return res.status(status.error).send(errorMessage);
  } finally {
    await db.close();
  }
};

const handouts = {
  getAll,
  addHandouts,
  deleteHandout,
};

module.exports = handouts;
