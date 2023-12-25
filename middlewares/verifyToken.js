import jwt from "jsonwebtoken";

const verifyUser = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json({
      status: false,
      message: "თქვენ არ ხართ ავტორიზირებული!",
    });
  } else {
    jwt.verify(token, "jwtkey", (err, decoded) => {
      if (err) {
        res.json({
          status: false,
          message: "არასწორი თოქენი!",
        });
      } else {
        req.id = decoded.id;
        next();
      }
    });
  }
};

export default verifyUser;
