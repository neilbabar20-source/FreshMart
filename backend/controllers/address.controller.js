import Address from "../models/address.model.js";

// Add address : /api/address/add
export const addAddress = async (req, res) => {
  try {
    const { address } = req.body;
    const userId = req.user;

    await Address.create({
      ...address,
      userId,
    });

    res.status(201).json({
      success: true,
      message: "Address added successfully",
    });
  } catch (error) {
    console.log("ADD ADDRESS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// Get addresses : /api/address/get
export const getAddress = async (req, res) => {
  try {
    const userId = req.user;

    const addresses = await Address.find({ userId }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      addresses,
    });
  } catch (error) {
    console.log("GET ADDRESS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// Update address : /api/address/update
export const updateAddress = async (req, res) => {
  try {
    const { addressId, address } = req.body;
    const userId = req.user;

    if (!addressId) {
      return res.status(400).json({
        success: false,
        message: "Address ID is required",
      });
    }

    const updatedAddress = await Address.findOneAndUpdate(
      {
        _id: addressId,
        userId,
      },
      {
        ...address,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedAddress) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Address updated successfully",
      address: updatedAddress,
    });
  } catch (error) {
    console.log("UPDATE ADDRESS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};