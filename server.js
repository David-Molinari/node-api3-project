const express = require('express');
const morgan = require("morgan"); // remember to require the module after installing it
const helmet = require("helmet");

const postsRouter = require("./posts/postRouter");
const usersRouter = require("./users/userRouter");

const server = express();

//custom middleware
server.use(logger);
server.use(helmet());

server.use(morgan("short"));
server.use(express.json());

server.use("/api/posts", postsRouter);
server.use("/api/users", usersRouter);

module.exports = server;

function logger(req, res, next) {
  console.log(new Date(),`${req.method} Request to ${req.originalUrl}`);

  next();
}