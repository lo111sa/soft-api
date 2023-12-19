import { db } from "../db.js";
import moment from "moment";
import { visitsToObject } from "../utils/functions.js";

//Get Visits
// export const getDoctorsVisit = async (req, res) => {
//   let conn;
//   try {
//     conn = await db.getConnection();
//     const { group, doctor } = req.query;

//     const results = await conn.query(
//       `SELECT d.id AS doctor_id, d.name AS doctor_name, v.patientId AS patient_id,  p.name AS patient_name, v.time AS visit_time
//       FROM doctors as d
//          LEFT JOIN ambulRecords as v ON d.id = v.doctorId
//          LEFT JOIN patients as p ON p.id = v.patientId
//       WHERE ${group ? "d.groupId = ?" : "d.id = ?"}

//   `,
//       group ? group : doctor
//     );
//     const visits = visitsToObject(results);

//     res.json(visits);
//   } catch (error) {
//     res.json(error);
//   } finally {
//     if (conn) return conn.end();
//   }
// };

//Get Amb Visits
export const getAmb = async (req, res) => {
  let conn;

  try {
    conn = await db.getConnection();
    const { patientId, pn, startDate, endDate, all } = req.query;

    let whereClause = "1=1"; // Default condition to retrieve all records

    if (patientId) {
      whereClause += ` AND p.id = ${patientId}`;
    }

    if (pn) {
      whereClause += ` AND p.pn LIKE "${pn}%" OR p.name LIKE "%${pn}%"`;
    }

    if (!all) {
      if (startDate && endDate) {
        whereClause += ` AND date(dv.createdAt) BETWEEN '${startDate}' AND '${endDate}'`;
      } else {
        const todayDate = moment().format("YYYY-MM-DD");
        whereClause += ` AND date(dv.createdAt) = ${todayDate}`;
      }
    }

    const result = await conn.query(
      `SELECT
      dv.id AS id,
      d.id AS doctorId,
      d.name AS doctorName,
      p.id AS patientId,
      p.name AS patientName,
      p.pn AS patientPn,
      dv.createdAt AS visitTime,
      dv.paid AS status
    FROM
      ambulRecords dv
      JOIN doctors d ON dv.doctorId = d.id
      JOIN patients p ON dv.patientId = p.id
     
    WHERE
    ${whereClause}
    ORDER BY dv.createdAt DESC
  `,
      []
    );

    res.json({
      status: true,
      result: result,
    });
  } catch (error) {
    res.json({
      status: false,
      message: "ამბულატორიული ჩანაწერების ძებნისას მოხდა შეცდომა!",
      error: error,
    });
  } finally {
    if (conn) return conn.end();
  }
};

//ამბულატორიული ვიზიტის დამატება
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
      status: true,
      message: "ამბულატორიული ვიზიტი დამატებულია",
      result: {
        id: parseInt(result.insertId),
      },
    });
  } catch (error) {
    res.json({
      status: false,
      message: "ამბულატორიული ვიზიტის დამატებისას მოხდა შეცდომა!",
      error: error,
    });
  } finally {
    if (conn) return conn.end();
  }
};

//Update ambul visit
export const updateAmbulRecords = async (req, res) => {
  let conn;
  try {
    conn = await db.getConnection();
    await conn.query(
      "UPDATE ambulRecords SET `doctorId`=?,`patientId`=?, WHERE id = ?",
      [req.body.doctorId, req.body.patientId, currentDate, req.params.id]
    );
    return res.json({ message: "ამბულატორიული ვიზიტი განახლებულია" });
  } catch (error) {
    res.json(error);
  } finally {
    if (conn) return conn.end();
  }
};
