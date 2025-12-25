const express = require("express");
const app = express();
const PORT = 8080 || process.env.PORT;
const cors = require("cors");
const { authRouter } = require("./routes/authRoutes");
const { postRoutes } = require("./routes/postRoutes");
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes :
app.use("/auth/user", authRouter);
app.use("/home/user", postRoutes);

app.get("/", (req, res) => {
    res.send("YUP working.");
});


app.listen(PORT, () => console.log("server startd"));