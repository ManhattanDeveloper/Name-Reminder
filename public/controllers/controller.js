var myApp = angular.module('myApp',[]);
myApp.controller('AppCtrl',['$scope','$http',
	function($scope, $http){

		//Refreshes the contact UI to correctly represent in the information in the database.
		//This is called whenever an operation is done that changes the data in the database.
		var refresh = function(){
			$http.get("/contactlist").success(function(response){
				$scope.contactlist = response;
				$scope.task = '';
			});
		};

		refresh();

		//Sends a post request to the database when the user adds a contact.
		$scope.addContact = function(){
			console.log($scope.task);

			$http.post('/addToArray', $scope.task).success(function(response){
				refresh();
			});

		};

		$scope.sendMsg = function(){
			console.log($scope.task);

			$http.post('/sendMsg', $scope.task).success(function(response){
				refresh();
			});

		};

		$scope.sendRandom = function(){
			console.log($scope.task);

			$http.post('/sendRandom', $scope.task).success(function(response){
				refresh();
			});

		};

		//Removes an element from the database based on a given id. 
		//Refreshes the page to correctly represent the data in the database.
		$scope.deleteName = function(name){
			$http.delete('/contactlist/' + name);
			refresh();

		};

}]);
