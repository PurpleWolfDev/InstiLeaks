const express = require("express");
const app = express();
const PORT = 8080 || process.env.PORT;
const webpush = require("web-push");
const cors = require("cors");
const { authRouter } = require("./routes/authRoutes");
const { postRoutes } = require("./routes/postRoutes");
app.use(cors());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Routes :
app.use("/auth/user", authRouter);
app.use("/home/user", postRoutes);

app.get("/", (req, res) => {
    res.send("YUP working.");
});


app.listen(PORT, () => console.log("server startd"));