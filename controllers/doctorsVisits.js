import { db } from "../db.js";
import jwt from "jsonwebtoken";
import { visitsToObject } from "../utils/functions.js";

//Get Visits
export const getDoctorsVisit = async (req, res) => {
  let conn;
  try {
    conn = await db.getConnection();
    const { group, doctor } = req.query;

    const results = await conn.query(
      `SELECT d.id AS doctor_id, d.name AS doctor_name, v.patientId AS patient_id,  p.name AS patient_name, v.time AS visit_time
      FROM doctors as d
         LEFT JOIN doctorsVisits as v ON d.id = v.doctorId 
         LEFT JOIN patients as p ON p.id = v.patientId
      WHERE ${group ? "d.groupId = ?" : "d.id = ?"}  
      
  `,
      group ? group : doctor
    );
    const visits = visitsToObject(results);

    res.json(visits);
  } catch (error) {
    res.json(error);
  } finally {
    if (conn) return conn.end();
  }
};

//Get Amb Visits
export const getAmb = async (req, res) => {
  let conn;
  try {
    conn = await db.getConnection();
    const { patientId, doctor } = req.query;

    const results = await conn.query(
      `SELECT
      dv.id AS id,
      d.id AS doctorId,
      d.name AS doctorName,
      p.id AS patientId,
      p.name AS patientName,
      p.pn AS patientPn,
      dv.createdAt AS visitTime
    FROM
      doctorsVisits dv
      JOIN doctors d ON dv.doctorId = d.id
      JOIN patients p ON dv.patientId = p.id
      JOIN doctorsGroups dg ON dv.groupId = dg.id   
    ${patientId ? `WHERE p.id = ?` : ""}  
  `,
      patientId
    );

    res.json(results);
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
      "INSERT INTO doctorsVisits (`groupId`,`doctorId`,`patientId`,time,createdAt) VALUES (?,?,?,?,?)",
      [
        req.body.groupId,
        req.body.doctorId,
        req.body.patientId,
        req.body.time,
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
