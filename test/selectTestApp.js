/**
 * Created by pi on 8/29/16.
 */
var selectTestApp = angular.module('selectTestApp', []);
selectTestApp.config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{');
    $interpolateProvider.endSymbol('}]}');
});
selectTestApp.controller('SelectTestCtrl', function ($scope, $http, $filter) {

    //internal variables



    $scope.receiverStorages = [];
    $scope.senderStorages = [];

    $scope.isProduce = false;
    $scope.sender={
        id: -1,
    };
    $scope.changeStorages = changeStorages;
    changeStorages();

    function changeStorages() {
        if ($scope.isProduce) {
            $scope.receiverStorages = [
                {
                id: 1,
                ident: '501',
                category: 1
                },
                {
                    id: 2,
                    ident: '502',
                    category: 1
                },
                {
                    id: 3,
                    ident: '801',
                    category: 1
                },
                {
                    id: 4,
                    ident: '901',
                    category: 1
                },
                {
                    id: 5,
                    ident: '902',
                    category: 1
                }
            ];
            $scope.senderStorages = [
                {
                    id: 6,
                    ident: '001',
                    category: 10
                },
                {
                    id: 7,
                    ident: '002',
                    category: 10
                },
                {
                    id: 8,
                    ident: '003',
                    category: 10
                },
                {
                    id: 9,
                    ident: '004',
                    category: 10
                },
                {
                    id: 10,
                    ident: '005',
                    category: 10
                }
            ];
        } else {
            $scope.senderStorages = [
                {
                    id: 1,
                    ident: '501',
                    category: 1
                },
                {
                    id: 2,
                    ident: '502',
                    category: 1
                },
                {
                    id: 3,
                    ident: '801',
                    category: 1
                },
                {
                    id: 4,
                    ident: '901',
                    category: 1
                },
                {
                    id: 5,
                    ident: '902',
                    category: 1
                }
            ];
            $scope.receiverStorages = [
                {
                    id: 6,
                    ident: '001',
                    category: 10
                },
                {
                    id: 7,
                    ident: '002',
                    category: 10
                },
                {
                    id: 8,
                    ident: '003',
                    category: 10
                },
                {
                    id: 9,
                    ident: '004',
                    category: 10
                },
                {
                    id: 10,
                    ident: '005',
                    category: 10
                }
            ];
        }
    }
});