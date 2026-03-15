const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Product = require('./models/Product');
const Delivery = require('./models/Delivery');
const Transfer = require('./models/Transfer');
const Adjustment = require('./models/Adjustment');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const importData = async () => {
  try {
    await User.deleteMany();
    await Product.deleteMany();
    await Delivery.deleteMany();
    await Transfer.deleteMany();
    await Adjustment.deleteMany();

    const usersToCreate = [
      {
        name: 'Demo Owner',
        email: 'owner@company.com',
        password: 'owner123',
        role: 'owner',
      },
      {
        name: 'Demo Employee',
        email: 'employee@company.com',
        password: 'emp123',
        role: 'employee',
      },
    ];
    
    for (const u of usersToCreate) {
      await User.create(u); // This properly calls the pre('save') hook once
    }

    console.log('Users imported!');

    await Product.insertMany([
      {
        name: 'Steel Rods',
        sku: 'SR-001',
        category: 'Raw Material',
        unit: 'kg',
        stock: 2000,
        minStock: 500,
      },
      {
        name: 'Plastic Case',
        sku: 'PC-105',
        category: 'Parts',
        unit: 'pcs',
        stock: 650,
        minStock: 200,
      },
    ]);

    console.log('Products imported!');
    console.log('Database seeded successfully for Demo!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

importData();
