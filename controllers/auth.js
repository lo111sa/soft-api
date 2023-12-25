import { db } from "../db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    // CHECK EXISTING USER
    const checkUserQuery = "SELECT * FROM users WHERE username = ?";
    const userData = await db.query(checkUserQuery, [req.body.username]);

    if (userData.length) {
      return res.status(409).json("მომხმარებელი უკვე არსებობს!");
    }

    // Hash the password and create a user
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    const createUserQuery =
      "INSERT INTO users (`username`, `password`) VALUES (?, ?)";
    const createUserValues = [req.body.username, hash];

    await db.query(createUserQuery, createUserValues);

    return res.status(200).json("მომხარებელი წარმატებით დარეგისტრირდა.");
  } catch (error) {
    return res.status(500).json(error.message || "Internal Server Error");
  }
};

export const login = async (req, res) => {
  try {
    // CHECK USER
    const checkUserQuery = "SELECT * FROM users WHERE username = ?";
    const userData = await db.query(checkUserQuery, [req.body.username]);

    if (userData.length === 0) {
      return res.status(404).json("მომხარებელი ვერ მოიძებნა!");
    }

    // CHECK PASSWORD
    const isPasswordCorrect = bcrypt.compare(
      req.body.password,
      userData[0].password
    );

    if (!isPasswordCorrect) {
      return res.status(400).json("არასწორი მომხმარებელი ან პაროლი!");
    }

    // GENERATE JWT TOKEN
    const token = jwt.sign({ id: userData[0].id }, "jwtkey");

    // REMOVE PASSWORD FROM RESPONSE
    const { password, ...userWithoutPassword } = userData[0];

    // SET COOKIE AND SEND USER DATA
    res
      .cookie("token", token, {
        httpOnly: true,
      })
      .status(200)
      .json({ status: true, result: userWithoutPassword });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json(error.message || "Internal Server Error");
  }
};

export const checkAuth = async (req, res) => {
  try {
    // CHECK USER
    const checkUserQuery = "SELECT * FROM users WHERE id = ?";
    const userData = await db.query(checkUserQuery, [req.id]);

    if (userData.length === 0) {
      return res.status(404).json("მომხარებელი ვერ მოიძებნა!");
    }

    // REMOVE PASSWORD FROM RESPONSE
    const { password, ...userWithoutPassword } = userData[0];

    res.status(200).json({
      status: true,
      result: { ...userWithoutPassword, authenticated: true },
    });
  } catch (error) {
    return res.status(500).json(error.message || "Internal Server Error");
  }
};

export const logout = (req, res) => {
  res
    .clearCookie("token", {
      sameSite: "none",
      secure: true,
    })
    .status(200)
    .json("თქვენ გმაოხვედით სისტემიდან.");
};
