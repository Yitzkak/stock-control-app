var mainController = angular.module('mainController',['ngRoute']);

mainController.config(['$routeProvider',function($routeProvider) {
    $routeProvider
    .when('/',{
      templateUrl:'views/home.html'
    }).when('/upload',{
      templateUrl:'views/upload.html',
    
    }).otherwise({
      redirect:'/home'
    }) ;
}]);
