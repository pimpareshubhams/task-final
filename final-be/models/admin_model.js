const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: false,
    unique: false,
  },
  password: {
    type: String,
    required: false,
  },
  phone: {
    type: String,
    required: false,
  },
  city: {
    type: String,
    required: false,
  },
  state: {
    type: String,
    required: false,
  },
  gender: {
    type: String,
    required: false,
  },
  sources: {
    type: [String],
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now
},
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

mongoose.model('AdminModel', adminSchema);
