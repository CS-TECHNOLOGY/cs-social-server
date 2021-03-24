import mongoose from "mongoose";
import IProfile from "./interface";
const ProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  company: {
    type: {
      type: String,
    },
  },
  website: {
    type: String,
  },
  location: {
    type: String,
  },
  status: {
    type: String,
    required: true,
  },
  skills: {
    type: [String],
    required: true,
  },
  bio: {
    type: String,
  },
  experience: [
    {
      title: {
        type: String,
      },
      company: {
        type: String,
      },
      location: {
        type: String,
      },
      from: {
        type: Date,
        required: true,
      },
      to: { type: Date, required: true },
      current: { type: Boolean, default: false },
      description: {
        type: String,
      },
    },
  ],
  education: [
    {
      school: {
        type: String,
      },
      degree: {
        type: String,
      },
      fieldOfStudy: {
        type: String,
      },
      from: {
        type: Date,
        required: true,
      },
      to: { type: Date, required: true },
      current: { type: Boolean, default: false },
      description: {
        type: String,
      },
    },
  ],
  social: {
    youtube: {
      type: String,
    },
    twitter: {
      type: String,
    },
    facebook: {
      type: String,
    },
    instagram: {
      type: String,
    },
    linkedin: {
      type: String,
    },
    zalo: {
      type: String,
    },
  },
  date: Date,
});

export default mongoose.model<IProfile & mongoose.Document>("user", ProfileSchema);
