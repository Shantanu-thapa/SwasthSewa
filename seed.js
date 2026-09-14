const mongoose = require("mongoose");
const dotenv = require("dotenv");

const Hospital = require("./model/hospital");
const Bed = require("./model/bedModel");

dotenv.config();
const hospitals = [
  {
    name: "Swasthya Care Hospital",
    location: "Civil Lines, Agra",
    totalBeds: 10,
    availableBeds: 7,
    contactNumber: "9876501001",
  },
  {
    name: "City General Hospital",
    location: "Sanjay Place, Agra",
    totalBeds: 10,
    availableBeds: 6,
    contactNumber: "9876501002",
  },
  {
    name: "LifeCare Multispeciality Hospital",
    location: "Kamla Nagar, Agra",
    totalBeds: 8,
    availableBeds: 5,
    contactNumber: "9876501003",
  },
  {
    name: "Shanti Medical Center",
    location: "Fatehabad Road, Agra",
    totalBeds: 8,
    availableBeds: 4,
    contactNumber: "9876501004",
  },
  {
    name: "CarePoint Hospital",
    location: "Sikandra, Agra",
    totalBeds: 10,
    availableBeds: 7,
    contactNumber: "9876501005",
  },
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    // Clear existing hospital and bed data
    await Bed.deleteMany({});
    await Hospital.deleteMany({});

    console.log("Old hospital and bed data cleared");

    // Create hospitals
    const createdHospitals = await Hospital.insertMany(hospitals);

    console.log(
      `${createdHospitals.length} hospitals created`
    );

    // Create beds for each hospital
    const beds = [];

    createdHospitals.forEach((hospital) => {
      for (let i = 1; i <= hospital.totalBeds; i++) {
        beds.push({
          hospital: hospital._id,
          bedNumber: `B${String(i).padStart(3, "0")}`,
          status:
            i <= hospital.availableBeds
              ? "available"
              : "occupied",
        });
      }
    });

    await Bed.insertMany(beds);

    console.log(`${beds.length} beds created`);

    console.log("Hospital and bed seeding completed successfully");

    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();