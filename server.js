require ("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authroutes");

const app = express();

app.use(cors());
app.use(express.json())
app.use('/auth',authRoutes);
// database Connection

connectDB();

app.get('/', (req,res) => {
    res.send("authentication API is running");  
});

const PORT = process.env.PORT || 5000


app.listen(PORT, () => {
    console.log(`SERVER IS RUNNING ON PORT ${PORT}`)
})