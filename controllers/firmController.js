const Firm = require('../models/Firm');
const Vendor = require('../models/Vendor');
const multer = require('multer');
const path = require('path');

// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Where images are stored
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  }
});

const upload = multer({ storage });

// Add a new firm
const addFirm = async (req, res) => {
  try {
    const { firmName, area, category, region, offer } = req.body;
    const image = req.file ? req.file.filename : undefined;

    const vendor = await Vendor.findById(req.vendorId);
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    if (vendor.firm.length > 0) {
      return res.status(400).json({ message: "Vendor can have only one firm" });
    }

    const firm = new Firm({
      firmName,
      area,
      category,
      region,
      offer,
      image,
      vendor: vendor._id
    });

    const savedFirm = await firm.save();
    vendor.firm.push(savedFirm);
    await vendor.save();

    return res.status(200).json({
      message: 'Firm added successfully',
      firmId: savedFirm._id,
      vendorFirmName: savedFirm.firmName
    });

  } catch (error) {
    console.error("Error in addFirm:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete a firm by ID
const deleteFirmById = async (req, res) => {
  try {
    const { firmId } = req.params;

    const deletedFirm = await Firm.findByIdAndDelete(firmId);
    if (!deletedFirm) {
      return res.status(404).json({ error: "Firm not found" });
    }

    res.status(200).json({ message: "Firm deleted successfully" });

  } catch (error) {
    console.error("Error in deleteFirmById:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  addFirm: [upload.single('image'), addFirm],
  deleteFirmById
};
