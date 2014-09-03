'use strict';

//Articles service used for links REST endpoint
angular.module('mean.links').factory('Links', ['$resource',
  function($resource) {
    return $resource('links/:linkId', {
      linkId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
