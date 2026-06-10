require('dotenv').config();

const express = require('express');
const app = express();
const AppError = require("./utils/AppError");
const globalErrorHandler = require("./middlewares/globalErrorHandler");

app.use(express.json());
app.use(globalErrorHandler);

const dbConnection = require("./config/db");
dbConnection();

app.use(globalErrorHandler);

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.all(/(.*)/, (req, res, next) => {
    next ( new AppError("Not found", 404));
});


const port = process.env.PORT || 3000;

app.listen(port, () =>{
    console.log(`server is listening on ${port}`);
})