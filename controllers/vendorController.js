const Vendor = require('../models/Vendor');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const secretKey = process.env.WhatIsYourName;

// Register Vendor
const vendorRegister = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const vendorEmail = await Vendor.findOne({ email });
    if (vendorEmail) {
      return res.status(400).json({ error: "Email already taken" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newVendor = new Vendor({
      username,
      email,
      password: hashedPassword
    });

    await newVendor.save();

    console.log('Vendor registered');
    res.status(201).json({ message: "Vendor registered successfully" });

  } catch (error) {
    console.error("Error in vendorRegister:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Vendor Login
const vendorLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const vendor = await Vendor.findOne({ email });
    const isPasswordValid = vendor && await bcrypt.compare(password, vendor.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign({ vendorId: vendor._id }, secretKey, { expiresIn: "1h" });

    res.status(200).json({ success: "Login successful", token, vendorId: vendor._id });
    console.log(`${email} logged in successfully. Token: ${token}`);

  } catch (error) {
    console.error("Error in vendorLogin:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get All Vendors
const getAllVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find().populate('firm');
    res.status(200).json({ vendors });
  } catch (error) {
    console.error("Error in getAllVendors:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get Vendor by ID
const getVendorById = async (req, res) => {
  const vendorId = req.params.apple;

  try {
    const vendor = await Vendor.findById(vendorId).populate('firm');

    if (!vendor) {
      return res.status(404).json({ error: "Vendor not found" });
    }

    const vendorFirmId = vendor.firm[0]?._id || null;

    res.status(200).json({ vendorId, vendorFirmId, vendor });
    console.log("Vendor Firm ID:", vendorFirmId);

  } catch (error) {
    console.error("Error in getVendorById:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  vendorRegister,
  vendorLogin,
  getAllVendors,
  getVendorById
};
