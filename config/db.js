const mongoose = require ("mongoose");

const connectDB = async () => {
try{
    await mongoose.connect(process.env.MONGO_URI);
    console.log("DB connected");
    console.log("seeding sucessfully")
}
catch(error){
    console.log("Connection failed:", error.message);
    process.exit(1);
}
};

module.exports = connectDB ;
