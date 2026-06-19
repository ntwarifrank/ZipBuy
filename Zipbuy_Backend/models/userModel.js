import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    default: ""
  },
  lastName: {
    type: String,
    default: ""
  },
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    default: ""
  },
  mobileNumber: {
    type: String,
    default: ""
  },
  country: {
    type: String,
    default: ""
  },
  city: {
    type: String,
    default: ""
  },
  streetAddress: {
    type: String,
    default: ""
  },
  gender: {
    type: String,
    default: ""
  },

  // Role system
  role: {
    type: String,
    enum: ["client", "business", "admin"],
    default: "client"
  },
  isAdmin: {
    type: Boolean,
    default: false
  },

  // Business profile (only for role === 'business')
  businessProfile: {
    businessName: { type: String, default: "" },
    businessRegNumber: { type: String, default: "" },
    businessTaxId: { type: String, default: "" },
    businessPhone: { type: String, default: "" },
    businessAddress: {
      province: { type: String, default: "" },
      district: { type: String, default: "" },
      sector: { type: String, default: "" },
      street: { type: String, default: "" }
    },
    businessLogo: { type: String, default: "" },
    businessDescription: { type: String, default: "" },
    category: { type: String, default: "" }
  },

  // Verification documents
  documents: [
    {
      name: { type: String, required: true },
      url: { type: String, required: true },
      type: {
        type: String,
        enum: ["rdb_certificate", "tax_clearance", "national_id", "trading_license"],
        required: true
      },
      uploadedAt: { type: Date, default: Date.now }
    }
  ],

  // Business verification workflow
  verificationStatus: {
    type: String,
    enum: ["none", "pending", "approved", "rejected", "info_needed"],
    default: function () {
      return this.role === "business" ? "pending" : "none";
    }
  },
  verificationNotes: { type: String, default: "" },
  verifiedAt: { type: Date },
  verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  // Document verification tracking
  documentsVerified: [{ type: String }],
  documentsVerifiedAt: { type: Date },

  // Account status
  isActive: { type: Boolean, default: true },

  // Tracking
  lastLogin: { type: Date },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Auto-set isAdmin based on role
userSchema.pre("save", function (next) {
  if (this.role === "admin") {
    this.isAdmin = true;
  }
  next();
});

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

const User = mongoose.model("User", userSchema);

export default User;
