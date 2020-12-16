const express = require("express");
const uniqid = require("uniqid");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const { writeDB, readDB } = require("../../lib");
// const { writeFile } = require("fs-extra");
const { join } = require("path");
// const { pipeline } = require("stream");
// const zlib = require("zlib");
// const multer = require("multer");

// const upload = multer({});
// const reviewsImgDir = join(__dirname, "../../../public/img/reviews");

const attendeesJson = join(__dirname, "attendess.json");

const validationRules = [
  body("firstname").isString().ltrim(),
  body("lastname").isString().ltrim(),
  body("email").isEmail().exists(),
  body("timeOfArrival").isString(),
];

router.get("/", async (req, res, next) => {
  try {
    const db = await readDB(attendeesJson);
    if (db.length > 0) {
      res.send(db);
    } else {
      const e = new Error();
      e.httpStatusCode = 404;
      next(e);
    }
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
    const err = validationResult(req);
    if (!err.isEmpty()) {
      const e = new Error();
      e.message = err.array();
      e.httpStatusCode = 400;
      next(e);
    } else {
      const db = await readDB(attendeesJson);
      const newEntry = {
        ...req.body,
        id: uniqid(),
      };
      db.push(newEntry);
      await writeDB(db, attendeesJson);
      res.status(201).send({ _d: newEntry.id });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
