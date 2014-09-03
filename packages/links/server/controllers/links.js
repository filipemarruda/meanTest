'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Link = mongoose.model('Link'),
  _ = require('lodash');


/**
 * Find link by id
 */
exports.link = function(req, res, next, id) {
  Link.load(id, function(err, link) {
    if (err) return next(err);
    if (!link) return next(new Error('Failed to load link ' + id));
    req.link = link;
    next();
  });
};

/**
 * Create an link
 */
exports.create = function(req, res) {
  var link = new Link(req.body);
  link.user = req.user;

  link.save(function(err) {
    if (err) {
      return res.json(500, {
        error: 'Cannot save the link'
      });
    }
    res.json(link);

  });
};

/**
 * Update an link
 */
exports.update = function(req, res) {
  var link = req.link;

  link = _.extend(link, req.body);

  link.save(function(err) {
    if (err) {
      return res.json(500, {
        error: 'Cannot update the link'
      });
    }
    res.json(link);

  });
};

/**
 * Delete an link
 */
exports.destroy = function(req, res) {
  var link = req.link;

  link.remove(function(err) {
    if (err) {
      return res.json(500, {
        error: 'Cannot delete the link'
      });
    }
    res.json(link);

  });
};

/**
 * Show an link
 */
exports.show = function(req, res) {
  res.json(req.link);
};

/**
 * List of Links
 */
exports.all = function(req, res) {
  Link.find().sort('-created').populate('user', 'name username').exec(function(err, links) {
    if (err) {
      return res.json(500, {
        error: 'Cannot list the links'
      });
    }
    res.json(links);

  });
};
