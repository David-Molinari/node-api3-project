const express = require('express');
const morgan = require("morgan"); // remember to require the module after installing it
const helmet = require("helmet");

const postsRouter = require("./posts/postRouter");
const usersRouter = require("./users/userRouter");

const userDb = require("./users/userDb")

const server = express();

//custom middleware
server.use(logger);
server.use(helmet());

server.use(morgan("short"));
server.use(express.json());

server.use("/api/posts", postsRouter);
server.use("/api/users", usersRouter);

server.use((error, req, res, next) => {
  res.status(400).json({ error: "something broke!" });
});

module.exports = server;

function logger(req, res, next) {
  console.log(`${req.method} Request to ${req.originalUrl}`);

  next();
}