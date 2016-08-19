/**
 * Created by pi on 8/2/16.
 */
/**
 * Created by Operator on 5/13/2016.
 */

var jobApp = angular.module('jobApp', []);
jobApp.config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{');
    $interpolateProvider.endSymbol('}]}');
});
jobApp.controller('JobListCtrl', function ($scope, $http, $filter) {


    // $http.get('/admin/recipe/RecipeList/data').success(function (recipes) {
    //     console.log('recipes: ' + recipes);
    //     $scope.recipes = recipes;
    // });
    //var recipesStr = JSON.parse($("#recipes").val());
    $scope.jobs = JSON.parse($("#jobs").val());

    console.log("jobs: " +  $scope.jobs);



    $scope.LineIdent = $("#LineIdent").val();
    console.log("lineIdent: " +  $scope.LineIdent);
    $scope.result = "";
    // $scope.recipes = [
    //     {
    //         Ident: '001',
    //         Name: 'INT1 recipe template',
    //         LineIdent: 'INT1'
    //     },
    //     {
    //         Ident: '002',
    //         Name: 'INT2 recipe template',
    //         LineIdent: 'INT2'
    //     },
    //     {
    //         Ident: '003',
    //         Name: 'MIX1 recipe template',
    //         LineIdent: 'MIX1'
    //     }
    // ];
    //$scope functions
    $scope.createJob = createJob;


    //function defintions
    function createJob() {
        $.getJSON('/job/jobList/createJob/:' +$scope.LineIdent, function (newJobStr) {
            var newJob = JSON.parse(newJobStr);

            console.log('newJob: ' + newJobStr);
            console.log('newJob id: ' + newJob.id);
            console.log('newJob State: ' + newJob.DisplayState);
            $scope.jobs.push(newJob);
            window.location.replace("/job/jobList/:"+$scope.LineIdent);
        });
    }

    $scope.remove = function () {
        var toDeleteJobIds = [];
        var remainJobs =[];
        $scope.selectedAll = false;
        angular.forEach($scope.jobs, function (selectedJob) {
            if(selectedJob.selected){
                toDeleteJobIds.push(selectedJob.id);
            }else {
                remainJobs.push(selectedJob);
            }
        });
        $scope.jobs = remainJobs;
        var toDeleteJobIdsStr = JSON.stringify(toDeleteJobIds);
        console.log('toDeleteJobIdsStr: ' + toDeleteJobIdsStr);
        $.post('/job/jobList/deleteJob',{toDeleteJobIdsStr:toDeleteJobIdsStr}, function (data) {
            console.log(data);
        });

    };
    $scope.checkAll = function () {
        // if (!$scope.selectedAll) {
        //     $scope.selectedAll = true;
        // } else {
        //     $scope.selectedAll = false;
        // }
        angular.forEach($scope.jobs, function (job) {
            job.selected = $scope.selectedAll;
        });
    };

});
jobApp.controller('JobDetailCtrl', function ($scope, $http, $filter) {

    //internal variables
    var targetXML = {};
    var resourceXML = {};
    var filterList = {
        id: '',
        label: '',
        OriginalText: '',
        innerText: ''
    };
    var log = "";
    var targetTexts = [];
    var resourceTexts = [];
    $scope.recipe = JSON.parse($("#recipe").val());
    // $scope.recipe = {
    //     id: $("#id").val(),
    //     Ident: $("#Ident").val(),
    //     Name: $("#Name").val(),
    //     JobIdent: $("#JobIdent").val(),
    //     LineIdent: $("#LineIdent").val(),
    //     SenderList: $("#SenderList").val(),
    //     ReceiverList: $("#ReceiverList").val()
    // };
    //console.log($("#recipe").val());
    console.log($scope.recipe);
    $scope.result = "";


    $scope.update = function () {
        var recipeStr = JSON.stringify($scope.recipe);
        $.getJSON('/admin/recipe/RecipeDetail/UpdateRecipe/:'+ recipeStr, function (message) {
            console.log(message);
            $scope.result = message;
            window.location.replace("/admin/recipe/RecipeList");
        })
    }

});
jobApp.filter('getByLabel', function () {
    return function (input, label) {
        var i = 0, len = input.length;
        for (; i < len; i++) {
            if (input[i].label == label) {
                return input[i];
            }
        }
        return null;
    }
});


