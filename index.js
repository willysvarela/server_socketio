const express = require("express");
const router = express.Router();
const http = require("http");

const app = express();

app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "*");

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware
  next();
});

app.use(router);

const server = http.createServer(app);

const socket = require("socket.io");

const io = socket(server, { pingInterval: 10000, pingTimeout: 5000 });

let interval;

io.on("connection", (socket) => {
  console.log("client on");
  if (interval) {
    clearInterval(interval);
  }
  interval = setInterval(() => getApiAndEmit(socket), 1000);
  socket.on("disconnect", () => {
    console.log("disconnected");
    clearInterval(interval);
  });
});

const getApiAndEmit = (socket) => {
  const response = "pesado2";
  socket.emit("FromAPI", response);
};

router.get("/heavy", (req, res) => {
  const array = [...Array(30000).keys()];

  io.emit("heavycall", { atual: 0, total: 0 });
  console.log(req.query.event);

  array.forEach((value, i) => {
    io.emit(req.query.event, {
      atual: Math.round(((i + 1) * 100) / array.length),
      i: i,
      total: array.length
    });
  });

  res.send({ oi: "oi" }).status(200);
});

router.get("/other", (req, res) => {
  res.send({ oi: "2" }).status(200);
});

server.listen(4000, () => console.log("open"));
