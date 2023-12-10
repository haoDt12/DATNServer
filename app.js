var createError = require("http-errors");
var express = require("express");

var socketIO = require('socket.io');
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var apiRouter = require("./routes/api");
var app = express();
var cors = require('cors');
var http = require('http')
const server = http.createServer(app)
const { Server } = require('socket.io')
const { readFileSync } = require("fs");
const { createServer } = require("http");
const httpServer = createServer((req, res) => {
  if (req.url !== "/") {
    res.writeHead(404);
    res.end("Not found");
    return;
  }
  // reload the file every time
  const content = readFileSync(__dirname + "/views/chat.pug");
  const length = Buffer.byteLength(content);

  res.writeHead(200, {
    "Content-Type": "text/html",
    "Content-Length": length,
  });
  res.end(content);
});
const session = require('express-session');
const sessionConfig = require('./models/session.config');
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(session(sessionConfig));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/api", apiRouter);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});


const io = new Server(server, {
  // Socket.IO options
});
io.on("connection", (socket) => {
  console.log(`connect ${socket.id}`);

  socket.on("disconnect", (reason) => {
    console.log(`disconnect ${socket.id} due to ${reason}`);
  });

  socket.on('on-chat', data => {
    io.emit('user-chat', data)
  })
});

var host = process.env.HOST || '0.0.0.0';
var post = process.env.PORT || 3000;
// httpServer.listen(3333);
server.listen(post, (req, res) => {
  console.log("connect to port 3000");
});
module.exports = server;
