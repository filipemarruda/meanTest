'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;


/**
 * Link Schema
 */
var LinkSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  label: {
    type: String,
    required: true,
    trim: true
  },
  link: {
    type: String,
    required: true,
    trim: true
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

/**
 * Validations
 */
LinkSchema.path('label').validate(function(label) {
  return !!label;
}, 'Label cannot be blank');

LinkSchema.path('link').validate(function(link) {
  return !!link;
}, 'Link cannot be blank');

/**
 * Statics
 */
LinkSchema.statics.load = function(id, cb) {
  this.findOne({
    _id: id
  }).populate('user', 'name username').exec(cb);
};

mongoose.model('Link', LinkSchema);
