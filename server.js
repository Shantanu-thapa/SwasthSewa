const express = require ("express");
const app = express();

const seedDatabase = require("./seedData");
const cors = require("cors");
require ("dotenv").config();
const PORT = process.env.PORT || 5000;

//middleware
app.use(express.json());
app.use(cors());

const connectDB = require("./config/db")
connectDB();  

//route connection 
const Auth = require("./routes/Patient");
const HospitalList = require("./routes/Hospital");
const Booking = require("./routes/bookingRoutes");
const Bed = require("./routes/bedRoutes");
const Dashboard = require("./routes/dashboardRoutes");

app.use("/api/v1", Auth);
app.use("/api/v1/Hospital", HospitalList);
app.use("/api/v1/Book",Booking);
app.use("/api/v1/Bed", Bed);
app.use("/api/v1" , Dashboard);

app.get("/", (req, res) => {
  res.status(200).json({
    message: "SwasthSewa API is running",
  });
});




app.listen(PORT , () => {
    console.log(`APP is Running ${PORT}`)
});






