/**
 * Created by pi on 8/2/16.
 */
/**
 * Created by Operator on 5/13/2016.
 */

var recipeApp = angular.module('recipeApp', []);
recipeApp.config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{');
    $interpolateProvider.endSymbol('}]}');
});
recipeApp.controller('RecipeListCtrl', function ($scope, $http, $filter) {

    $scope.selectedAll = false;

    // $http.get('/admin/recipe/RecipeList/data').success(function (recipes) {
    //     console.log('recipes: ' + recipes);
    //     $scope.recipes = recipes;
    // });
    var recipesStr = JSON.parse($("#recipes").val());
    console.log("recipesStr: " + recipesStr);
    $scope.recipes = JSON.parse($("#recipes").val());
    console.log("recipes: " + $scope.recipes);
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
    $scope.createRecipe = createRecipe;


    //function defintions
    function createRecipe() {
        $.getJSON('/admin/recipe/RecipeList/createRecipe', function (newRecipe) {
            console.log('newRecipe: ' + newRecipe);
            console.log('newRecipe id: ' + newRecipe.id);
            $scope.recipes.push(newRecipe);
        });
    }

    $scope.remove = function () {
        var toDeleteIds = [];
        var remainRecipes = [];
        $scope.selectedAll = false;
        angular.forEach($scope.recipes, function (selectedRecipe) {
            if (selectedRecipe.selected) {
                toDeleteIds.push(selectedRecipe.id);
            } else {
                remainRecipes.push(selectedRecipe);
            }
        });
        $scope.recipes = remainRecipes;
        var toDeleteIdsStr = JSON.stringify(toDeleteIds);
        $.getJSON('/admin/recipe/RecipeList/deleteRecipe/:' + toDeleteIdsStr, function (data) {
            console.log(data);
        });

    };
    $scope.checkAll = function () {
        // if (!$scope.selectedAll) {
        //     $scope.selectedAll = true;
        // } else {
        //     $scope.selectedAll = false;
        // }
        angular.forEach($scope.recipes, function (recipe) {
            recipe.selected = $scope.selectedAll;
        });
    };
    $scope.update = function () {

    }

});
recipeApp.controller('RecipeDetailCtrl', function ($scope, $http, $filter) {

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
    $scope.senders =[];
    $scope.receivers =[];
    $scope.sendersSelectedAll = false;
    $scope.receiversSelectedAll = false;
    getIngredients(0);
    getIngredients(1);
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
        $.getJSON('/admin/recipe/RecipeDetail/UpdateRecipe/:' + recipeStr, function (message) {
            console.log(message);
            $scope.result = message;
            window.location.replace("/admin/recipe/RecipeList");
        })
    };

    $scope.senderCheckAll = function () {
        angular.forEach($scope.senders, function (sender) {
            sender.selected = $scope.sendersSelectedAll;
        });
    };
    $scope.createSender = function () {
        var newSender = {
            Category: 0,
            TargetPercentage: 0,

        };

    };
    $scope.removeSender = function () {

    };
    $scope.receiversCheckAll = function () {
        angular.forEach($scope.receivers, function (receiver) {
            receiver.selected = $scope.receiversSelectedAll;
        });
    };
    $scope.createReceiver = function () {

    };
    $scope.removeReceiver = function () {

    };

    function getIngredients(category) {
        $.getJSON('/admin/recipe/RecipeDetail/getIngredients/:' + category, function (ingredients) {
            if (category == 0) {
                $scope.senders = ingredients;
            } else {
                $scope.receivers = ingredients;
            }

        });
    }

});
recipeApp.filter('getByLabel', function () {
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


