import { db } from "../db.js";
import jwt from "jsonwebtoken";

//Get patients
export const getPatients = async (req, res, next) => {
  let conn;
  try {
    conn = await db.getConnection();
    const rows = await conn.query(`SELECT * FROM patients`);
    res.json(rows);
  } catch (error) {
    next(error);
  } finally {
    if (conn) return conn.end();
  }
};

//Get single patient
export const getPatient = async (req, res) => {
  const { pn } = req.query;
  let conn;
  try {
    conn = await db.getConnection();
    const result = await conn.query(
      "SELECT * FROM patients WHERE pn LIKE ?",
      `%${pn}%`
    );
    res.json(result);
  } catch (error) {
    res.json(error);
  } finally {
    if (conn) return conn.end();
  }
};

//Add new patient
export const addPatient = async (req, res) => {
  let conn;
  const currentDate = new Date();
  try {
    conn = await db.getConnection();
    //Check if patient exists
    const patientExists = await conn.query(
      `SELECT pn FROM patients WHERE pn = ?`,
      [req.body.pn]
    );

    if (patientExists.length) {
      res.json({ message: "პაციენტი უკვე არსებობს" });
    } else {
      // If Patient not exists, add new patient
      const result = await conn.query(
        "INSERT INTO patients (`name`,`birthDate`,`pn`,`gender`,`address`,`city`,`tel`,`tel1`,`email`,`createdBy`,`createdAt`) VALUES (?,?,?,?,?,?,?,?,?,?,?)",
        [
          req.body.name,
          currentDate,
          req.body.pn,
          req.body.gender,
          req.body.address,
          req.body.city,
          req.body.tel,
          req.body.tel1,
          req.body.email,
          req.body.createdBy,
          currentDate,
        ]
      );

      if (result.insertId) {
        return res.json({
          result: {
            id: parseInt(result.insertId),

            createdAt: currentDate,
          },
          message: "პაციენტი დამატებულია",
        });
      }
    }
  } catch (error) {
    res.json(error);
  } finally {
    if (conn) return conn.end();
  }
};

//Update patient
export const updatePatient = async (req, res) => {
  let conn;
  try {
    conn = await db.getConnection();
    await conn.query(
      "UPDATE patients SET `name`=?,`birthDate`=?,`pn`=?,`gender`=?,`address`=?,`city`=?,`tel`=?,`tel1`=?,`email`=?,`createdBy`=?,`createdAt`=? WHERE id = ?",
      [
        req.body.name,
        req.body.birthDate,
        req.body.pn,
        req.body.gender,
        req.body.address,
        req.body.city,
        req.body.tel,
        req.body.tel1,
        req.body.email,
        req.body.createdBy,
        req.body.createdAt,
        req.params.id,
      ]
    );
    return res.json({ message: "პაციენტის მონაცემები განახლებულია" });
  } catch (error) {
    res.json(error);
  } finally {
    if (conn) return conn.end();
  }
};

//Delete patient
export const deletePatient = async (req, res) => {
  let conn;
  try {
    conn = await db.getConnection();
    await conn.query(`DELETE FROM patients WHERE id=?`, req.params.id);
    res.json({ message: "პაციენტის მონაცემები წაიშალა" });
  } catch (error) {
    res.json(error);
  } finally {
    if (conn) return conn.end();
  }
};
