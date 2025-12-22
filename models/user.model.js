import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required."],
    validate: {
      validator: function (v) {
        return /^[a-zA-Z\s]+$/.test(v);
      },
      message: (props) =>
        `${props.value} is not a valid name! Name must only contain letters and spaces `,
    },
  },
  email: {
    type: String,
    required: [true, "Email is required."],
    validate: {
      validator: function (v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: (props) => `${props.value} is not a valid email address!`,
    },
  },
  password: {
    type: String,
    required: [true, "Password is required."],
    validate: {
      validator: function (v) {
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/.test(
          v
        );
      },
      message: (props) =>
        `${props.value} is not a valid password! Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.`,
    },
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
});

// Hash password before saving it to db
userSchema.pre("save", async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// compare password with hashed password
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

export const User = mongoose.model("User", userSchema);
