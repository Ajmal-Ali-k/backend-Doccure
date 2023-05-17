const jwt = require("jsonwebtoken");

const clientVerify = async (req, res, next) => {
  let token = req.header("Authorization");

  try {
    if (!token)
      return res
        .status(404)
        .json({ message: "Authentication failed: no token provided." });

    if (token.startsWith("Bearer")) {
      token = token.slice(6, token.length).trimLeft();
    }

    const verified = await jwt.verify(token, process.env.JWT_SECRET);

    req.user = verified;

    if (verified.role === "clientLogin") {
      next();
    } else {
      res
        .status(404)
        .json({ message: "Authentication failed: invalid token." });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(404)
      .json({ message: "Authentication failed: invalid token." });
  }
};

const adminVerify = async (req, res, next) => {
  let token = req.header("Authorization");

  try {
    if (!token)
      return res
        .status(404)
        .json({ message: "Authentication failed: no token provided." });

    if (token.startsWith("Bearer")) {
      token = token.slice(6, token.length).trimLeft();
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = verified;

    if (verified.role === "adminLogin") {
      next();
    } else {
      res
        .status(404)
        .json({ message: "Authentication failed: invalid token." });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(404)
      .json({ message: "Authentication failed: invalid token." });
  }
};

const doctorVerify = async (req, res, next) => {
  let token = req.header("Authorization");

  try {
    if (!token)
      return res
        .status(404)
        .json({ message: "Authentication failed: no token provided." });

    if (token.startsWith("Bearer")) {
      token = token.slice(6, token.length).trimLeft();
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET);

    req.doctor = verified;

    if (verified.role === "doctorLogin") {
      next();
    } else {
      res
        .status(404)
        .json({ message: "Authentication failed: invalid token." });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(404)
      .json({ message: "Authentication failed: invalid token." });
  }
};

const chatVerify = async (req, res, next) => {
  let token = req.header("Authorization");

  try {
    if (!token)
      return res
        .status(404)
        .json({ message: "Authentication failed: no token provided." });

    if (token.startsWith("Bearer")) {
      token = token.slice(6, token.length).trimLeft();
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET);

    req.chat = verified;


    next();
  } catch (error) {
    console.log(error);
    return res
      .status(404)
      .json({ message: "Authentication failed: invalid token." });
  }
};

// export const generateToken = (data) => {
//     const token = jwt.sign(data, process.env.JWT_SECRET,{headers:{Authorization: "Bearer" + token}});
//     return token;
// };

module.exports = { clientVerify, adminVerify, doctorVerify, chatVerify };
