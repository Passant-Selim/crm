require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("../models/User");

const seedSuperAdmin = async () => {
  try {
    
    await mongoose.connect(process.env.MONGO_URI);

    console.log("Database Connected from seed file");

    
    const existingAdmin = await User.findOne({
      email: process.env.SUPER_ADMIN_EMAIL,
    });

    if (existingAdmin) {
      console.log("Super Admin already exists");
      process.exit();
    }

    const hashedPassword = await bcrypt.hash(
      process.env.SUPER_ADMIN_PASSWORD,
      10
    );

  
    await User.create({
      userName: process.env.SUPER_ADMIN_NAME,
      email: process.env.SUPER_ADMIN_EMAIL,
      password: hashedPassword,
      role: process.env.SUPER_ADMIN_ROLE,
    });

    console.log("Super Admin Created Successfully");

  } catch (error) {
    console.log(error);
  }  finally {
      await mongoose.connection.close();
      console.log("DB Is Closed");
      process.exit(0);
    }
};

seedSuperAdmin();