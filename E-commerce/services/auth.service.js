import { User } from "../models/user.model.js";
import {
  generateAccessToken,
  generateRefreshToken,
  setCookies,
  generateResetToken,
  verifyResetToken,
} from "../lib/token.utils.js";
import { createError } from "../lib/createError.util.js";
import { sendWelcomeEmail, sendPasswordResetEmail } from "./email.service.js";
import jwt from "jsonwebtoken";


export const authService = {
    signup: async (userData) => {
        const { name, email, password, role } = userData;

        const userExists = await User.findOne({email: email});
        if(userExists){
            throw createError(400, 'Email already exist, please use a different email')
        }

        const user = new User ({ name, email, password, role });
        await user.save();
        
        // send welcome email (non-blocking)
        sendWelcomeEmail(user.email, user.name).catch(err => 
          console.error('Welcome email failed:', err)
        );
        
        return user;
    },

    signin: async (email, password) => {
        const user = await User.findOne({email: email});
        if(!user){
            throw createError(400, 'Invalid email, please enter a valid email');
            
        }
        const isPasswordValid = await user.comparePassword(password);
        if(!isPasswordValid){
            throw createError(400, 'Invalid password, please enter a valid password');
        }

        return user;
    },

    handleTokens: async (user, res) => {
      const accessToken = generateAccessToken(user._id, user.role);
      const refreshToken = generateRefreshToken(user._id);
      setCookies(res, accessToken, refreshToken);
    },

    logout: async (refreshToken) => {
        if(!refreshToken){
            throw createError(401, 'No refresh token found- User May have been logged out.')
        }
        try {
            const decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
      );
            
        } catch (error) {
           throw createError(401, 'Invalid refresh token.') 
        }
    },

     initiatePasswordReset: async function (email) {
    const user = await User.findOne({ email });
    if (!user) {
      throw createError(404, "User not found, please try again");
    }

    const resetToken = generateResetToken(user._id);
    
    // send password reset email (non-blocking)
    sendPasswordResetEmail(user.email, resetToken).catch(err =>
      console.error('Password reset email failed:', err)
    );
    
    return resetToken;
  },
    resetPassword: async (resetToken, newPassword) => {
      const decoded = verifyResetToken(resetToken);
      const user = await User.findById(decoded.userId);

      const isSamePassword = await user.comparePassword(newPassword);
      if (isSamePassword) {
        throw createError(400, 'New password cannot be the same as the old password');
      }

      user.password = newPassword;
      await user.save();
    }
};