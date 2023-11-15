import mariadb from "mariadb";

export const db = mariadb.createPool({
  //charset: "utf8mb4",
  host: "localhost",
  user: "root",
  password: "123temoTEMO",
  database: "eyeline",
  connectTimeout: 60000,
});
