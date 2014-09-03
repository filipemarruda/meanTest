'use strict';

var links = require('../controllers/links');

// Link authorization helpers
var hasAuthorization = function(req, res, next) {
  if (!req.user.isAdmin && req.link.user.id !== req.user.id) {
    return res.send(401, 'User is not authorized');
  }
  next();
};

module.exports = function(Articles, app, auth) {

  app.route('/links')
    .get(links.all)
    .post(auth.requiresLogin, links.create);
  app.route('/links/:linkId')
    .get(links.show)
    .put(auth.requiresLogin, hasAuthorization, links.update)
    .delete(auth.requiresLogin, hasAuthorization, links.destroy);

  // Finish with setting up the linkId param
  app.param('linkId', links.link);
};
