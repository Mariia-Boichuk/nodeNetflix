const { registerUser, login } = require("../controllers/authControllers");

const authRouter = require("express").Router();

authRouter.post("/register", registerUser);
authRouter.post("/login", login);

module.exports = authRouter;
