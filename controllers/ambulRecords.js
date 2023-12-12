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
         LEFT JOIN ambulRecords as v ON d.id = v.doctorId 
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
    const { patientId } = req.query;

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
      ambulRecords dv
      JOIN doctors d ON dv.doctorId = d.id
      JOIN patients p ON dv.patientId = p.id
     
    ${patientId ? `WHERE p.id = ?` : ""}  ORDER BY dv.createdAt DESC
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
export const addAmbulRecords = async (req, res) => {
  let conn;
  const currentDate = new Date();
  try {
    conn = await db.getConnection();
    const result = await conn.query(
      "INSERT INTO ambulRecords (`doctorId`,`patientId`,createdAt) VALUES (?,?,?)",
      [req.body.doctorId, req.body.patientId, currentDate]
    );
    return res.json({
      result: {
        id: parseInt(result.insertId),
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
export const updateAmbulRecords = async (req, res) => {
  let conn;
  try {
    conn = await db.getConnection();
    await conn.query(
      "UPDATE ambulRecords SET `doctorId`=?,`patientId`=?, WHERE id = ?",
      [req.body.doctorId, req.body.patientId, currentDate, req.params.id]
    );
    return res.json({ message: "ვიზიტი განახლებულია" });
  } catch (error) {
    res.json(error);
  } finally {
    if (conn) return conn.end();
  }
};

//Delete DoctorsGroup
export const deleteAmbulRecords = async (req, res) => {
  let conn;
  try {
    conn = await db.getConnection();
    await conn.query(`DELETE FROM ambulRecords WHERE id=?`, req.params.id);
    res.json({ message: "ვიზიტი წაიშალა" });
  } catch (error) {
    res.json(error);
  } finally {
    if (conn) return conn.end();
  }
};
