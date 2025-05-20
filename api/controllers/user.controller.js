import User from "../models/user.model.js";
import createError from "../utils/createError.js";
import bcrypt from "bcryptjs";

export const deleteUser = async(_req, res, next)=>{
    //TODO
    const user = await User.findById(_req.params.id);

        if (_req.userId !== user._id.toString()){
         return next(createError(403, "You cannot delete this account!"));
        }
         await User.findByIdAndDelete(_req.params.id);
         res.status(200).send("User has been deleted!");
 };


// Fetch user profile
export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming `req.user` is populated by authentication middleware
    const user = await User.findById(userId).select('-password'); // Exclude password from the response

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Failed to fetch user profile' });
  }
};


// Update user settings
export const updateSettings = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming `req.user` is populated by authentication middleware
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update the password
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: 'Settings updated successfully' });
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ message: 'Failed to update settings' });
  }
};