import { db } from "../db.js";
import jwt from "jsonwebtoken";

//Get patients
export const getDoctorsGroups = async (req, res, next) => {
  let conn;
  try {
    conn = await db.getConnection();
    const rows = await conn.query(`SELECT * FROM doctorsGroups`);
    res.json(rows);
  } catch (error) {
    next(error);
  } finally {
    if (conn) {
      await conn.end();
    }
  }
};

//Get single DoctorsGroup
export const getDoctorsGroup = async (req, res) => {
  let conn;
  try {
    conn = await db.getConnection();
    const result = await conn.query(
      "SELECT * FROM doctorsGroups WHERE id=?",
      req.params.id
    );
    res.json(result);
  } catch (error) {
    res.json(error);
  } finally {
    if (conn) {
      await conn.end();
    }
  }
};

//Add new DoctorsGroup
export const addDoctorsGroup = async (req, res) => {
  let conn;

  try {
    conn = await db.getConnection();
    const result = await conn.query(
      "INSERT INTO doctorsGroups (`title`) VALUES (?)",
      [req.body.title]
    );
    return res.json({
      result: {
        id: parseInt(result.insertId),
        ...req.body,
      },
      message: "ჯგუფი დამატებულია",
    });
  } catch (error) {
    res.json(error);
  } finally {
    if (conn) {
      await conn.end();
    }
  }
};

//Update DoctorsGroup
export const updateDoctorsGroup = async (req, res) => {
  let conn;
  try {
    conn = await db.getConnection();
    await conn.query("UPDATE doctorsGroups SET `title`=? WHERE id = ?", [
      req.body.title,
      req.params.id,
    ]);
    return res.json({ message: "ჯგუფი განახლებულია" });
  } catch (error) {
    res.json(error);
  } finally {
    if (conn) {
      await conn.end();
    }
  }
};

//Delete DoctorsGroup
export const deleteDoctorsGroup = async (req, res) => {
  let conn;
  try {
    conn = await db.getConnection();
    await conn.query(`DELETE FROM doctorsGroups WHERE id=?`, req.params.id);
    res.json({ message: "ჯგუფი წაიშალა" });
  } catch (error) {
    res.json(error);
  } finally {
    if (conn) {
      await conn.end();
    }
  }
};
