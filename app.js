var app = angular.module("wordList", ['ngRoute', 'ngAnimate']);

app.config(function($routeProvider) {
  $routeProvider
    .when('/uebersicht', {
      templateUrl: 'uebersicht.html'
    })
    .when('/uebersicht/:id', {
      templateUrl: 'details.html'
    })
    .when('/zufallswort', {
      templateUrl: 'zufallswort.html'
    })
    .otherwise({
      redirectTo: '/uebersicht'
    });

});


app.controller("myCtrl", function($scope, $location, $routeParams, $filter) {

  $scope.word = {};
  $scope.sortType = "-voting";
  $scope.showVoteMsg = 0;
  $scope.curPage = 0;
  $scope.pageSize = 10;

  $scope.savedWords = localStorage.getItem('words');
  var words = (localStorage.getItem('words')!==null) ? JSON.parse($scope.savedWords) : [];
  var wordsOrdered = $filter('orderBy')(words, '-voting');
  $scope.words = wordsOrdered;

  $scope.id = (localStorage.getItem('id')!==null) ? localStorage.getItem('id') : 0;


  $scope.$on('$routeChangeSuccess', function() {
    var id_selectedWord = $routeParams.id;
    $scope.id_selectedWord = parseInt(id_selectedWord, 10);
    $scope.index_selectedWord = $scope.words.indexOf($filter('filter')($scope.words, {id: $scope.id_selectedWord}, true)[0]);
  }); 

  $scope.numberOfPages = function() {
    return Math.ceil($scope.words.length / $scope.pageSize);
  };


  $scope.isActive = function(route) {
    return route === $location.path();
  };

  $scope.isSorted = function(sortType) {
    return ($scope.sortType == sortType);
  };

  $scope.saveWord = function(){
    $scope.words = $filter('orderBy')($scope.words, '-voting');
    localStorage.setItem('words', JSON.stringify($scope.words));
    $scope.words = JSON.parse(localStorage.getItem('words'));
  };

  $scope.addWord  = function (){
    if(!$scope.word.name){
      return;
    }
    else {
      var timestamp = new Date();
      $scope.words.push({id:$scope.id++, name:$scope.word.name, voting:0, date:timestamp});
      $scope.word.name = "";
      $scope.saveWord();
      localStorage.setItem('id', JSON.stringify($scope.id));
    }
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

  $scope.findSelWordIndex = function() {
    $scope.index_selectedWord = $scope.words.indexOf($filter('filter')($scope.words, {id: $scope.id_selectedWord}, true)[0]);
  };

  $scope.findRndWordIndex = function() {
    $scope.index_randomWord = $scope.words.indexOf($filter('filter')($scope.words, {id: $scope.id_randomWord}, true)[0]);
  };


  $scope.randomWord = function() {
    $scope.random = Math.floor(Math.random() * $scope.words.length);
    $scope.id_randomWord = $scope.words[$scope.random].id;
    $scope.findRndWordIndex();
  };
});

app.filter('pagination', function() {
  return function(input, start) {
    if (!input || !input.length) { return; }
    start = +start;
    return input.slice(start);
  };
});
