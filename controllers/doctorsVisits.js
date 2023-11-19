import { db } from "../db.js";
import jwt from "jsonwebtoken";
import { visitsToObject } from "../utils/functions.js";

//Get patients
export const getDoctorsVisits = async (req, res, next) => {
  let conn;
  try {
    conn = await db.getConnection();
    const rows = await conn.query(`SELECT * FROM doctorsVisits`);
    res.json(rows);
  } catch (error) {
    next(error);
  } finally {
    if (conn) return conn.end();
  }
};

//Get single DoctorsGroup
export const getDoctorsVisit = async (req, res) => {
  let conn;
  try {
    conn = await db.getConnection();

    const results = await conn.query(
      `SELECT
      d.id AS doctor_id,
      d.name AS doctor_name,
      p.id AS patient_id,
      p.name AS patient_name,
      dv.time AS visit_time
    FROM
      doctorsVisits dv
      JOIN doctors d ON dv.doctorId = d.id
      JOIN patients p ON dv.patientId = p.id
      JOIN doctorsGroups dg ON dv.groupId = dg.id;
  `,
      req.params.id
    );
    const visits = visitsToObject(results);

    res.json(visits);
    console.log(results);
  } catch (error) {
    res.json(error);
  } finally {
    if (conn) return conn.end();
  }
};

//Add new DoctorsGroup
export const addDoctorsVisit = async (req, res) => {
  let conn;
  const currentDate = new Date();
  try {
    conn = await db.getConnection();
    const result = await conn.query(
      "INSERT INTO doctorsVisits (`groupId`,`doctorId`,`patientId`,timeId,createdAt) VALUES (?,?,?,?,?)",
      [
        req.body.groupId,
        req.body.doctorId,
        req.body.patientId,
        req.body.timeId,
        currentDate,
      ]
    );
    return res.json({
      result: {
        id: parseInt(result.insertId),
        ...req.body,
        createdAt: currentDate,
      },
      message: "ვიზიტი დამატებულია",
    });
  } catch (error) {
    res.json(error);
  } finally {
    if (conn) return conn.end();
  }
};

//Update DoctorsGroup
export const updateDoctorsVisit = async (req, res) => {
  let conn;
  try {
    conn = await db.getConnection();
    await conn.query(
      "UPDATE doctorsVisits SET `groupId`=?,`doctorId`=?,`patientId`=?,`timeId`=? WHERE id = ?",
      [
        req.body.groupId,
        req.body.doctorId,
        req.body.patientId,
        req.body.timeId,
        currentDate,
        req.params.id,
      ]
    );
    return res.json({ message: "ვიზიტი განახლებულია" });
  } catch (error) {
    res.json(error);
  } finally {
    if (conn) return conn.end();
  }
};

//Delete DoctorsGroup
export const deleteDoctorsVisit = async (req, res) => {
  let conn;
  try {
    conn = await db.getConnection();
    await conn.query(`DELETE FROM doctorsVisits WHERE id=?`, req.params.id);
    res.json({ message: "ვიზიტი წაიშალა" });
  } catch (error) {
    res.json(error);
  } finally {
    if (conn) return conn.end();
  }
};
