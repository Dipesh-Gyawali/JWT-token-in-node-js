const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();
const secretKey = "secretKey";

// Middleware to parse JSON payloads
app.use(express.json());

app.get("/", (req, resp) => {
  resp.json({
    message: "a sample api",
  });
});

app.post("/login", (req, resp) => {
  const user = {
    id: 1,
    username: "dipesh",
    email: "dipes@gmail.com",
  };
  jwt.sign({ user }, secretKey, { expiresIn: "300s" }, (err, token) => {
    resp.json({
      token,
    });
  });
});

app.post("/profile", verifyToken, (req, resp) => {
  jwt.verify(req.token, secretKey, (err, authData) => {
    if (err) {
      resp.send({ result: "invalid token" });
      console.log("Token received:", req.token);
    } else {
      resp.json({
        message: "profile accessed",
        authData,
      });
    }
  });
});

function verifyToken(req, resp, next) {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    const token = bearer[1];
    req.token = token;
    console.log(req.token, "Token from login");
    next();
  } else {
    resp.send({
      result: "Token is not valid",
    });
  }
}

app.listen(5000, () => {
  console.log("app is running on 5000 port");
});
