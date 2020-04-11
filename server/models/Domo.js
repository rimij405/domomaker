// Import libraries/middleware
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
const _ = require('underscore');

// Prepare model.
let DomoModel = {};

// Validation methods.
const convertId = mongoose.Types.ObjectId;
const setName = (name) => _.escape(name).trim();

// Create Schema.
const DomoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },
  age: {
    type: Number,
    min: 0,
    required: true,
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

// Static methods.

// API conversion.
DomoSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  age: doc.age,
});

// Find by owner.
DomoSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
  };
  return DomoModel.find(search).select('name age').lean().exec(callback);
};

// Create the model from the Schema.
DomoModel = mongoose.model('Domo', DomoSchema);

// Export.
module.exports.DomoModel = DomoModel;
module.exports.DomoSchema = DomoSchema;
