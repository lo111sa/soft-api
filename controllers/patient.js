import { db } from "../db.js";
import jwt from "jsonwebtoken";

//Get patients
export const getPatients = async (req, res) => {
  let conn;
  try {
    conn = await db.getConnection();
    const rows = await conn.query(`SELECT * FROM patient`);
    res.json(rows);
  } catch (error) {
    res.json(error);
  } finally {
    if (conn) return conn.end();
  }
};

//Get single patient
export const getPatient = (req, res) => {};

//Add new patient
export const addPatient = (req, res) => {};

//Delete patient
export const deletePatient = (req, res) => {};

//Update patient
export const updatePatient = (req, res) => {};
