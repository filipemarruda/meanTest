'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Link = mongoose.model('Link');

/**
 * Globals
 */
var user;
var link;

/**
 * Test Suites
 */
describe('<Unit Test>', function() {
  describe('Model Link:', function() {
    beforeEach(function(done) {
      user = new User({
        name: 'Full name',
        email: 'test@test.com',
        username: 'user',
        password: 'password'
      });

      user.save(function() {
        link = new Link({
          label: 'Link Title',
          link: 'Link Content',
          user: user
        });

        done();
      });
    });

    describe('Method Save', function() {
      it('should be able to save without problems', function(done) {
        return link.save(function(err) {
          should.not.exist(err);
          link.label.should.equal('Link Title');
          link.link.should.equal('Link Content');
          link.user.should.not.have.length(0);
          link.created.should.not.have.length(0);
          done();
        });
      });

      it('should be able to show an error when try to save without label', function(done) {
        link.label = '';

        return link.save(function(err) {
          should.exist(err);
          done();
        });
      });

      it('should be able to show an error when try to save without link', function(done) {
        link.link = '';

        return link.save(function(err) {
          should.exist(err);
          done();
        });
      });

      it('should be able to show an error when try to save without user', function(done) {
        link.user = {};

        return link.save(function(err) {
          should.exist(err);
          done();
        });
      });

    });

    afterEach(function(done) {
      link.remove();
      user.remove();
      done();
    });
  });
});
