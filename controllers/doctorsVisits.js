import { db } from "../db.js";
import jwt from "jsonwebtoken";

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
    const doctor = await conn.query(
      "SELECT * FROM doctors WHERE id=?",
      req.params.id
    );
    const result = await conn.query(
      `SELECT doctorsVisits.patientId,  doctorsVisits.timeId
      FROM doctors
      JOIN doctorsVisits ON doctors.id = doctorsVisits.doctorId
      WHERE doctors.id = ?`,
      req.params.id
    );
    res.json({ result: result, doctor: doctor });
    console.log(result);
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
