const mongoose = require('mongoose');

const alumniSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, 'Please provide a valid email address'],
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    graduationYear: {
      type: Number,
      required: [true, 'Graduation year is required'],
      min: [1950, 'Graduation year is too early'],
      max: [2050, 'Graduation year is invalid'],
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      trim: true,
      enum: {
        values: ['CSE', 'IT', 'ECE', 'Mechanical', 'Civil', 'MBA', 'Other'],
        message: '{VALUE} is not a supported department',
      },
    },
    currentCompany: {
      type: String,
      trim: true,
      default: '',
    },
    jobTitle: {
      type: String,
      trim: true,
      default: '',
    },
    city: {
      type: String,
      trim: true,
      default: '',
    },
    country: {
      type: String,
      trim: true,
      default: 'India',
    },
    skills: {
      type: [String],
      default: [],
    },
    linkedinUrl: {
      type: String,
      trim: true,
      default: '',
    },
    bio: {
      type: String,
      trim: true,
      default: '',
    },
    isMentor: {
      type: Boolean,
      default: false,
    },
    profilePhoto: {
      type: String,
      default: 'https://i.pravatar.cc/150?img=1',
    },
  },
  {
    timestamps: true,
  }
);

// Text indexing for fast search
alumniSchema.index({ fullName: 'text', currentCompany: 'text', skills: 'text' });

module.exports = mongoose.model('Alumni', alumniSchema);

