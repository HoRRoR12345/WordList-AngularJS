var app = angular.module("wordList", ['ngRoute', 'ngAnimate']);

app.config(function($routeProvider) {
  $routeProvider
    .when('/uebersicht', {
      templateUrl: 'uebersicht.html',
      controller: 'myCtrl'
    })
    .when('/uebersicht/:param', {
      templateUrl: 'details.html',
      controller: 'myCtrl'
    })
    .when('/zufallswort', {
      templateUrl: 'zufallswort.html',
      controller: 'myCtrl'
    })
    .otherwise({
      redirectTo: '/uebersicht'
    });

});


app.controller("myCtrl", function($scope, $location, $routeParams, $filter) {

  $scope.word = "";
  $scope.sortType = "-voting";

  $scope.curPage = 0;
  $scope.pageSize = 10;
  $scope.showMsg = 0;

  $scope.savedWords = localStorage.getItem('words');
  var words = (localStorage.getItem('words')!==null) ? JSON.parse($scope.savedWords) : [];
  var wordsOrdered = $filter('orderBy')(words, '-voting');
  $scope.words = wordsOrdered;

  $scope.id = (localStorage.getItem('id')!==null) ? localStorage.getItem('id') : 0;

  var selWord = $routeParams.param;
  $scope.selWord = parseInt(selWord, 10);
  $scope.selWord = $scope.words.indexOf($filter('filter')($scope.words, {id: $scope.selWord}, true)[0]);


  $scope.numberOfPages = function() {
    return Math.ceil($scope.words.length / $scope.pageSize);
  };


  $scope.isActive = function(route) {
    return route === $location.path();
  };

  $scope.isSorted = function(sortType) {
    return ($scope.sortType == sortType);
  };

  $scope.saveOrdered = function(){
    $scope.words = $filter('orderBy')($scope.words, '-voting');
    localStorage.setItem('words', JSON.stringify($scope.words));
    localStorage.setItem('id', JSON.stringify($scope.id));
    $scope.words = JSON.parse(localStorage.getItem('words'));
  };

  $scope.save = function(){
    localStorage.setItem('words', JSON.stringify($scope.words));
  };

  $scope.addWord  = function (){
    if(!$scope.word){
      return;
    }
    else {

      var timestamp = new Date();
      $scope.words.push({id:$scope.id++, wordname:$scope.word, voting:0, date:timestamp});
      $scope.word = "";
    }
    $scope.saveOrdered();
  };

  $scope.decreaseVoting = function (index) {
    $scope.words[index].voting--;
  };

  $scope.increaseVoting = function (index) {
    $scope.words[index].voting++;
  };

  $scope.sortBy = function(sortType) {
    $scope.sortType = sortType;
    $scope.curPage = 0;
  };

  $scope.showDetails = function(id) {
    $scope.selWord = $scope.words.indexOf($filter('filter')($scope.words, {id: id}, true)[0]);
  };


  $scope.randomWord = function() {
    $scope.random = Math.floor(Math.random() * $scope.words.length);
  };
});

app.filter('pagination', function() {
  return function(input, start) {
    if (!input || !input.length) { return; }
    start = +start;
    return input.slice(start);
  };
});
