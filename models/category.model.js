import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: true,
      trim: true,
      minlength: [2, "Category name must be at least 2 characters"],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    subcategories: {
      type: [{ type: String, trim: true }],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Auto-generate slug from name before saving
categorySchema.pre("save", function () {
  if (this.isModified("name")) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  }
});

export const Category = mongoose.model("Category", categorySchema);
