const express = require("express");
const uniqid = require("uniqid");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const { writeDB, readDB, err, mg } = require("../../lib");
// const { writeFile } = require("fs-extra");
const { join } = require("path");

// const { pipeline } = require("stream");
// const zlib = require("zlib");
// const multer = require("multer");
// const upload = multer({});

const attendeesJson = join(__dirname, "attendees.json");

const validationRules = [
  body("firstname").isString().ltrim().exists(),
  body("lastname").isString().ltrim().exists(),
  body("email").isEmail().exists(),
  body("timeOfArrival").isString().exists(),
];

router.get("/", async (req, res, next) => {
  try {
    const db = await readDB(attendeesJson);
    res.send(db);
    // if (db.length > 0) {
    //   res.send(db);
    // } else {
    //   const e = new Error();
    //   e.httpStatusCode = 404;
    //   next(e);
    // }
  } catch (error) {
    next(error);
  }
});
router.get("/csv", async (req, res, next) => {
  try {
    //this route must return full list of attendees exported as a CSV file (use stream from json2csv npm module)
  } catch (error) {
    next(error);
  }
});

router.post("/", validationRules, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      err(errors.array());
    } else {
      const db = await readDB(attendeesJson);
      const newEntry = {
        ...req.body,
        id: uniqid(),
      };
      db.push(newEntry);
      await writeDB(db, attendeesJson);
      mg("Registered", JSON.stringify(newEntry));
      res.status(201).send({ id: newEntry.id });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

module.exports = router;
