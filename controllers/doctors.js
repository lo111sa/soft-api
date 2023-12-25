import { db } from "../db.js";

//Get patients
export const getDoctors = async (req, res) => {
  let conn;
  try {
    conn = await db.getConnection();
    const rows = await conn.query(`SELECT * FROM doctors`);
    res.json(rows);
  } catch (error) {
  } finally {
    if (conn) {
      await conn.end();
    }
  }
};

//Get single Doctor
export const getDoctor = async (req, res) => {
  let conn;
  try {
    conn = await db.getConnection();
    const result = await conn.query(
      "SELECT * FROM doctors WHERE groupId=?",
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

//Add new Doctor
export const addDoctor = async (req, res) => {
  let conn;

  try {
    conn = await db.getConnection();
    const result = await conn.query(
      "INSERT INTO doctors (`name`,`groupId`) VALUES (?,?)",
      [req.body.name, req.body.groupId]
    );
    return res.json({
      result: {
        id: parseInt(result.insertId),
        ...req.body,
      },
      message: "ექიმი დამატებულია",
    });
  } catch (error) {
    res.json(error);
  } finally {
    if (conn) {
      await conn.end();
    }
  }
};

//Update Doctor
export const updateDoctor = async (req, res) => {
  let conn;
  try {
    conn = await db.getConnection();
    await conn.query("UPDATE doctors SET `name`=?, `groupId`=? WHERE id = ?", [
      req.body.name,
      req.body.groupId,
      req.params.id,
    ]);
    return res.json({ message: "ექიმის მონაცემები განახლებულია" });
  } catch (error) {
    res.json(error);
  } finally {
    if (conn) {
      await conn.end();
    }
  }
};

//Delete Doctor
export const deleteDoctor = async (req, res) => {
  let conn;
  try {
    conn = await db.getConnection();
    await conn.query(`DELETE FROM doctors WHERE id=?`, req.params.id);
    res.json({ message: "ექიმის მონაცემები წაიშალა" });
  } catch (error) {
    res.json(error);
  } finally {
    if (conn) {
      await conn.end();
    }
  }
};
