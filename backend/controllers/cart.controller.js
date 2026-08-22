import User from "../models/user.model.js";

// update user cartData: /api/cart/update

export const updateCart = async (req, res) => {
  try {
    const userId = req.user;
    const { cartItems } = req.body;
   const updateUser=  await User.findByIdAndUpdate(userId, { cartItems }, { new: true });
   if (!updateUser) {
    return res
    .status(404)
    .json({ message: "User no found", success:false})
   }
    res.status(200).json({  updateCart ,success: true, message: "Cart updated succesfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};