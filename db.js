import mariadb from "mariadb";

export const db = mariadb.createPool({
  //charset: "utf8mb4",
  /*   host: "losa.ge",
  port: 3306,
  user: "losage_losa",
  password: "123asdASD!",
  database: "losage_eyeline",
  connectTimeout: 60000, */

  host: "127.0.0.1",
  port: 3306,
  user: "root",
  password: "",
  database: "losage_eyeline",
  connectTimeout: 60000,
});
