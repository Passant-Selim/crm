require('dotenv').config();

const express = require('express');
const app = express();
const AppError = require("./utils/AppError");
const globalErrorHandler = require("./middlewares/globalErrorHandler");

app.use(express.json());
app.use(globalErrorHandler);
app.use("/uploads", express.static("uploads"));

const dbConnection = require("./config/db");
dbConnection();


const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const teamRoutes = require("./routes/teamRoutes");
const propertyRoutes = require("./routes/propertyRoutes");
const leadRoutes = require("./routes/leadRoutes");
const agentRoutes = require("./routes/agentRoutes");
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/agents", agentRoutes);

app.use(globalErrorHandler);

app.all(/(.*)/, (req, res, next) => {
    next ( new AppError("Not found", 404));
});


const port = process.env.PORT || 3000;

app.listen(port, () =>{
    console.log(`server is listening on ${port}`);
})