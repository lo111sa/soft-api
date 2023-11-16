import mariadb from "mariadb";

export const db = mariadb.createPool({
  //charset: "utf8mb4",
  host: "192.168.100.10",
  port: 3306,
  user: "root",
  password: "123asdASD",
  database: "eyeline",
  connectTimeout: 60000,
});
