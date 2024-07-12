const { request, response } = require('express');
const User = require('../models/Users');
const errorHandler = require('../utils/errorHandler');


const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
      
        const resetToken = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        await user.save();
      
        // Send email with reset link
        const resetUrl = `${FRONTEND_BASE_URL}${resetToken}`;
        // Use a mail service to send the resetUrl to the user's email
        
        res.status(200).json({ message: 'Reset password email sent' });
    } catch (error){
        errorHandler(error, res);
    }
}