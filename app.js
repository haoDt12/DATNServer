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
var http = require('http')
var httpPlus = require('http').Server(app);
var server = http.createServer(app);
var io = socketIO(server);

const session = require('express-session');
const sessionConfig = require('./models/session.config');
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

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
io.on('connection', (socket) => {
  console.log('A user connected');

  // Xử lý sự kiện khi client gửi tin nhắn
  socket.on('chat message', (msg) => {
    // Xử lý tin nhắn và gửi lại cho tất cả client
    io.emit('chat message', msg);
  });

  // Các sự kiện khác có thể được xử lý ở đây
  // Đóng kết nối
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});
httpPlus.listen(3000, (req, res) => {
  console.log("connect to port 3000");
});
module.exports = app;
