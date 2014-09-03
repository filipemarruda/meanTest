'use strict';

angular.module('mean.links').controller('LinksController', ['$scope', '$stateParams', '$location', 'Global', 'Links',
  function($scope, $stateParams, $location, Global, Links) {
    $scope.global = Global;

    $scope.hasAuthorization = function(link) {
      if (!link || !link.user) return false;
      return $scope.global.isAdmin || link.user._id === $scope.global.user._id;
    };

    $scope.create = function(isValid) {
      if (isValid) {
        var link = new Links({
          label: this.label,
          link: this.link
        });
        link.$save(function(response) {
          $location.path('links/' + response._id);
        });

        this.label = '';
        this.link = '';
      } else {
        $scope.submitted = true;
      }
    };

    $scope.remove = function(link) {
      if (link) {
        link.$remove();

        for (var i in $scope.links) {
          if ($scope.links[i] === link) {
            $scope.links.splice(i, 1);
          }
        }
      } else {
        $scope.link.$remove(function(response) {
          $location.path('links');
        });
      }
    };

    $scope.update = function(isValid) {
      if (isValid) {
        var link = $scope.link;
        if (!link.updated) {
          link.updated = [];
        }
        link.updated.push(new Date().getTime());

        link.$update(function() {
          $location.path('links/' + link._id);
        });
      } else {
        $scope.submitted = true;
      }
    };

    $scope.find = function() {
      Links.query(function(links) {
        $scope.links = links;
      });
    };

    $scope.findOne = function() {
      Links.get({
        linkId: $stateParams.linkId
      }, function(link) {
        $scope.link = link;
      });
    };
  }
]);
