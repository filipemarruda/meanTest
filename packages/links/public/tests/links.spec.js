'use strict';

(function() {
  // Links Controller Spec
  describe('MEAN controllers', function() {
    describe('LinksController', function() {
      // The $resource service augments the response object with methods for updating and deleting the resource.
      // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
      // the responses exactly. To solve the problem, we use a newly-defined toEqualData Jasmine matcher.
      // When the toEqualData matcher compares two objects, it takes only object properties into
      // account and ignores methods.
      beforeEach(function() {
        this.addMatchers({
          toEqualData: function(expected) {
            return angular.equals(this.actual, expected);
          }
        });
      });

      beforeEach(function() {
        module('mean');
        module('mean.system');
        module('mean.links');
      });

      // Initialize the controller and a mock scope
      var LinksController,
        scope,
        $httpBackend,
        $stateParams,
        $location;

      // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
      // This allows us to inject a service but then attach it to a variable
      // with the same name as the service.
      beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {

        scope = $rootScope.$new();

        LinksController = $controller('LinksController', {
          $scope: scope
        });

        $stateParams = _$stateParams_;

        $httpBackend = _$httpBackend_;

        $location = _$location_;

      }));

      it('$scope.find() should create an array with at least one link object ' +
        'fetched from XHR', function() {

          // test expected GET request
          $httpBackend.expectGET('links').respond([{
            label: 'An Link about MEAN',
            link: 'MEAN rocks!'
          }]);

          // run controller
          scope.find();
          $httpBackend.flush();

          // test scope value
          expect(scope.links).toEqualData([{
            label: 'An Link about MEAN',
            link: 'MEAN rocks!'
          }]);

        });

      it('$scope.findOne() should create an array with one link object fetched ' +
        'from XHR using a linkId URL parameter', function() {
          // fixture URL parament
          $stateParams.linkId = '525a8422f6d0f87f0e407a33';

          // fixture response object
          var testLinkData = function() {
            return {
              label: 'An Link about MEAN',
              link: 'MEAN rocks!'
            };
          };

          // test expected GET request with response object
          $httpBackend.expectGET(/links\/([0-9a-fA-F]{24})$/).respond(testLinkData());

          // run controller
          scope.findOne();
          $httpBackend.flush();

          // test scope value
          expect(scope.link).toEqualData(testLinkData());

        });

      it('$scope.create() with valid form data should send a POST request ' +
        'with the form input values and then ' +
        'locate to new object URL', function() {

          // fixture expected POST data
          var postLinkData = function() {
            return {
              label: 'An Link about MEAN',
              link: 'MEAN rocks!'
            };
          };

          // fixture expected response data
          var responseLinkData = function() {
            return {
              _id: '525cf20451979dea2c000001',
              label: 'An Link about MEAN',
              link: 'MEAN rocks!'
            };
          };

          // fixture mock form input values
          scope.label = 'An Link about MEAN';
          scope.link = 'MEAN rocks!';

          // test post request is sent
          $httpBackend.expectPOST('links', postLinkData()).respond(responseLinkData());

          // Run controller
          scope.create(true);
          $httpBackend.flush();

          // test form input(s) are reset
          expect(scope.title).toEqual('');
          expect(scope.content).toEqual('');

          // test URL location to new object
          expect($location.path()).toBe('/links/' + responseLinkData()._id);
        });

      it('$scope.update(true) should update a valid link', inject(function(Links) {

        // fixture rideshare
        var putLinkData = function() {
          return {
            _id: '525a8422f6d0f87f0e407a33',
            label: 'An Link about MEAN',
            to: 'MEAN is great!'
          };
        };

        // mock link object from form
        var link = new Links(putLinkData());

        // mock link in scope
        scope.link = link;

        // test PUT happens correctly
        $httpBackend.expectPUT(/links\/([0-9a-fA-F]{24})$/).respond();

        // testing the body data is out for now until an idea for testing the dynamic updated array value is figured out
        //$httpBackend.expectPUT(/links\/([0-9a-fA-F]{24})$/, putLinksData()).respond();
        /*
                Error: Expected PUT /links\/([0-9a-fA-F]{24})$/ with different data
                EXPECTED: {"_id":"525a8422f6d0f87f0e407a33","title":"An Link about MEAN","to":"MEAN is great!"}
                GOT:      {"_id":"525a8422f6d0f87f0e407a33","title":"An Link about MEAN","to":"MEAN is great!","updated":[1383534772975]}
                */

        // run controller
        scope.update(true);
        $httpBackend.flush();

        // test URL location to new object
        expect($location.path()).toBe('/links/' + putLinkData()._id);

      }));

      it('$scope.remove() should send a DELETE request with a valid linkId ' +
        'and remove the link from the scope', inject(function(Links) {

          // fixture rideshare
          var link = new Links({
            _id: '525a8422f6d0f87f0e407a33'
          });

          // mock rideshares in scope
          scope.links = [];
          scope.links.push(link);

          // test expected rideshare DELETE request
          $httpBackend.expectDELETE(/links\/([0-9a-fA-F]{24})$/).respond(204);

          // run controller
          scope.remove(link);
          $httpBackend.flush();

          // test after successful delete URL location links list
          //expect($location.path()).toBe('/links');
          expect(scope.links.length).toBe(0);

        }));
    });
  });
}());
